// ============================================
// CONFIGURATION GOOGLE SHEETS
// ============================================
// IMPORTANT : Remplacez cette URL par votre URL de déploiement Google Apps Script
// Pour obtenir cette URL, suivez le guide GUIDE-HEBERGEMENT-ET-DONNEES.md
const GOOGLE_SHEET_URL = 'REMPLACEZ_PAR_VOTRE_URL_GOOGLE_SCRIPT';

// État du sondage
let currentSectionIndex = 0;
let responses = {};
let showingIntro = true;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeSurvey();
    loadSavedResponses();
    
    // Afficher l'introduction si elle existe
    if (surveyData.introduction) {
        renderIntroduction();
    } else {
        showingIntro = false;
        renderCurrentSection();
        updateProgress();
    }
    
    setupEventListeners();
});

// Initialiser le sondage
function initializeSurvey() {
    document.getElementById('totalSections').textContent = surveyData.sections.length;
}

// Charger les réponses sauvegardées
function loadSavedResponses() {
    const saved = localStorage.getItem('surveyResponses');
    if (saved) {
        responses = JSON.parse(saved);
    }
}

// Afficher la page d'introduction
function renderIntroduction() {
    const intro = surveyData.introduction;
    const container = document.getElementById('surveyContent');
    
    container.innerHTML = `
        <div class="section active" style="text-align: center;">
            <div class="section-header">
                <span class="section-emoji">🎭</span>
                <h2 class="section-title">${intro.title}</h2>
                ${intro.duration ? `<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">${intro.duration}</p>` : ''}
            </div>
            <div style="max-width: 600px; margin: 2rem auto; text-align: left;">
                <p style="font-size: 1.125rem; line-height: 1.8; color: var(--text-secondary);">
                    ${intro.text}
                </p>
            </div>
        </div>
    `;
    
    // Cacher la barre de progression pendant l'intro
    document.querySelector('.progress-wrapper').style.display = 'none';
    
    // Cacher le bouton précédent
    document.getElementById('prevBtn').style.display = 'none';
    
    // Changer le texte du bouton suivant
    document.getElementById('nextBtn').innerHTML = 'Commencer le questionnaire →';
}

// Sauvegarder les réponses
function saveResponses() {
    localStorage.setItem('surveyResponses', JSON.stringify(responses));
}

// Envoyer les données à Google Sheets
async function sendToGoogleSheets(data) {
    // Vérifier que l'URL est configurée
    if (GOOGLE_SHEET_URL === 'REMPLACEZ_PAR_VOTRE_URL_GOOGLE_SCRIPT') {
        console.warn('⚠️ Google Sheets URL non configurée. Les données sont sauvegardées localement uniquement.');
        return;
    }
    
    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('✅ Données envoyées à Google Sheets avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi à Google Sheets:', error);
        // Les données restent sauvegardées localement
    }
}

// Enregistrer toutes les réponses dans un tableau persistant
function saveToResults() {
    const allResults = JSON.parse(localStorage.getItem('allSurveyResults') || '[]');
    
    const result = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        responses: { ...responses }
    };
    
    // Sauvegarder localement (backup)
    allResults.push(result);
    localStorage.setItem('allSurveyResults', JSON.stringify(allResults));
    
    // Envoyer à Google Sheets
    sendToGoogleSheets(result);
}

// Afficher la section actuelle
function renderCurrentSection() {
    const section = surveyData.sections[currentSectionIndex];
    const container = document.getElementById('surveyContent');
    
    // Si on a fini toutes les sections, afficher la page de remerciement
    if (currentSectionIndex >= surveyData.sections.length) {
        renderThankYou();
        return;
    }
    
    let html = `
        <div class="section active">
            <div class="section-header">
                <span class="section-emoji">${section.emoji}</span>
                <h2 class="section-title">${section.title}</h2>
                <p class="section-description">${section.description}</p>
            </div>
    `;
    
    // Ajouter l'info-box pour la section 4 (Concept Agent IA)
    if (section.id === 4) {
        html += `
            <div class="info-box" style="margin-bottom: 2rem;">
                <strong>💡 Par exemple, cet agent IA pourrait :</strong><br><br>
                • Comprendre les règles du match d'impro (catégories, mi-temps, arbitrage)<br>
                • Générer des scénarios créatifs adaptés à votre niveau<br>
                • Donner des feedbacks précis sur la structure narrative, le jeu de scène, etc.<br>
                • Mémoriser vos sessions pour suivre votre progression<br>
                • S'adapter à votre style et vos objectifs
            </div>
        `;
    }
    
    // Afficher chaque question
    section.questions.forEach(question => {
        html += renderQuestion(question);
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Restaurer les réponses sauvegardées
    restoreResponses();
}

// Afficher une question
function renderQuestion(question) {
    let html = `
        <div class="question" data-question-id="${question.id}">
            <label class="question-label">
                ${question.label}
                ${question.required ? '<span class="question-required">*</span>' : ''}
            </label>
    `;
    
    switch (question.type) {
        case 'radio':
            html += renderRadioOptions(question);
            break;
        case 'checkbox':
            html += renderCheckboxOptions(question);
            break;
        case 'scale':
            html += renderScaleOptions(question);
            break;
        case 'text':
            html += renderTextInput(question);
            break;
        case 'textarea':
            html += renderTextarea(question);
            break;
    }
    
    html += '</div>';
    return html;
}

// Afficher les options radio
function renderRadioOptions(question) {
    let html = '<div class="options-list">';
    
    question.options.forEach(option => {
        html += `
            <div class="option-item">
                <input type="radio" 
                       name="${question.id}" 
                       id="${question.id}_${option.value}" 
                       value="${option.value}">
                <label class="option-label" for="${question.id}_${option.value}">
                    <span class="option-icon">${option.icon || ''}</span>
                    <span class="option-text">${option.text}</span>
                </label>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Afficher les options checkbox
function renderCheckboxOptions(question) {
    let html = '<div class="options-list">';
    
    question.options.forEach(option => {
        html += `
            <div class="option-item">
                <input type="checkbox" 
                       name="${question.id}" 
                       id="${question.id}_${option.value}" 
                       value="${option.value}"
                       data-question-id="${question.id}">
                <label class="option-label" for="${question.id}_${option.value}">
                    <span class="option-icon">${option.icon || ''}</span>
                    <span class="option-text">${option.text}</span>
                </label>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (question.maxChoices) {
        html += `<div class="choice-counter" id="counter_${question.id}">Sélectionnez jusqu'à ${question.maxChoices} réponses</div>`;
    }
    
    return html;
}

// Afficher une échelle de notation
function renderScaleOptions(question) {
    let html = '<div class="scale-container">';
    
    for (let i = question.scaleMin; i <= question.scaleMax; i++) {
        html += `
            <div class="scale-option">
                <input type="radio" 
                       name="${question.id}" 
                       id="${question.id}_${i}" 
                       value="${i}">
                <label class="scale-label" for="${question.id}_${i}">
                    <span class="scale-number">${i}</span>
                </label>
            </div>
        `;
    }
    
    html += '</div>';
    
    if (question.scaleLegends) {
        html += `
            <div class="scale-legends">
                <span>${question.scaleLegends.min}</span>
                <span>${question.scaleLegends.max}</span>
            </div>
        `;
    }
    
    return html;
}

// Afficher un champ texte
function renderTextInput(question) {
    return `
        <input type="text" 
               class="text-input" 
               id="${question.id}" 
               name="${question.id}"
               placeholder="${question.placeholder || ''}">
    `;
}

// Afficher une zone de texte
function renderTextarea(question) {
    return `
        <textarea class="textarea-input" 
                  id="${question.id}" 
                  name="${question.id}"
                  placeholder="${question.placeholder || ''}"></textarea>
    `;
}

// Restaurer les réponses pour la section actuelle
function restoreResponses() {
    const section = surveyData.sections[currentSectionIndex];
    
    section.questions.forEach(question => {
        const savedValue = responses[question.id];
        if (!savedValue) return;
        
        if (question.type === 'radio' || question.type === 'scale') {
            const input = document.querySelector(`input[name="${question.id}"][value="${savedValue}"]`);
            if (input) input.checked = true;
        } else if (question.type === 'checkbox') {
            savedValue.forEach(value => {
                const input = document.querySelector(`input[name="${question.id}"][value="${value}"]`);
                if (input) input.checked = true;
            });
            updateCheckboxCounter(question.id);
        } else if (question.type === 'text' || question.type === 'textarea') {
            const input = document.getElementById(question.id);
            if (input) input.value = savedValue;
        }
    });
}

// Collecter les réponses de la section actuelle
function collectCurrentResponses() {
    const section = surveyData.sections[currentSectionIndex];
    
    section.questions.forEach(question => {
        if (question.type === 'radio' || question.type === 'scale') {
            const selected = document.querySelector(`input[name="${question.id}"]:checked`);
            if (selected) {
                responses[question.id] = selected.value;
            }
        } else if (question.type === 'checkbox') {
            const selected = Array.from(document.querySelectorAll(`input[name="${question.id}"]:checked`))
                .map(input => input.value);
            if (selected.length > 0) {
                responses[question.id] = selected;
            }
        } else if (question.type === 'text' || question.type === 'textarea') {
            const input = document.getElementById(question.id);
            if (input && input.value.trim()) {
                responses[question.id] = input.value.trim();
            }
        }
    });
    
    saveResponses();
}

// Valider la section actuelle
function validateCurrentSection() {
    const section = surveyData.sections[currentSectionIndex];
    const errors = [];
    
    section.questions.forEach(question => {
        if (!question.required) return;
        
        if (question.type === 'radio' || question.type === 'scale') {
            const selected = document.querySelector(`input[name="${question.id}"]:checked`);
            if (!selected) {
                errors.push(`Veuillez répondre à : ${question.label}`);
            }
        } else if (question.type === 'checkbox') {
            const selected = document.querySelectorAll(`input[name="${question.id}"]:checked`);
            if (selected.length === 0) {
                errors.push(`Veuillez sélectionner au moins une option pour : ${question.label}`);
            }
        } else if (question.type === 'text' || question.type === 'textarea') {
            const input = document.getElementById(question.id);
            if (!input || !input.value.trim()) {
                errors.push(`Veuillez remplir : ${question.label}`);
            }
        }
    });
    
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    
    return true;
}

// Mettre à jour le compteur de cases à cocher
function updateCheckboxCounter(questionId) {
    const section = surveyData.sections[currentSectionIndex];
    const question = section.questions.find(q => q.id === questionId);
    
    if (!question || !question.maxChoices) return;
    
    const checked = document.querySelectorAll(`input[name="${questionId}"]:checked`);
    const counter = document.getElementById(`counter_${questionId}`);
    
    if (counter) {
        const remaining = question.maxChoices - checked.length;
        if (remaining > 0) {
            counter.textContent = `Vous pouvez sélectionner ${remaining} réponse(s) de plus`;
            counter.style.color = 'var(--text-muted)';
        } else {
            counter.textContent = `Maximum atteint (${question.maxChoices} réponses)`;
            counter.style.color = 'var(--warning-color)';
        }
    }
    
    // Désactiver les autres cases si max atteint
    const allCheckboxes = document.querySelectorAll(`input[name="${questionId}"]`);
    allCheckboxes.forEach(checkbox => {
        if (!checkbox.checked && checked.length >= question.maxChoices) {
            checkbox.disabled = true;
            checkbox.parentElement.querySelector('.option-label').style.opacity = '0.5';
        } else {
            checkbox.disabled = false;
            checkbox.parentElement.querySelector('.option-label').style.opacity = '1';
        }
    });
}

// Mettre à jour la barre de progression
function updateProgress() {
    const progress = ((currentSectionIndex + 1) / surveyData.sections.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('currentSection').textContent = currentSectionIndex + 1;
    
    // Gérer la visibilité des boutons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentSectionIndex === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-flex';
    }
    
    if (currentSectionIndex === surveyData.sections.length - 1) {
        nextBtn.innerHTML = '🚀 Envoyer mes réponses';
    } else {
        nextBtn.innerHTML = 'Continuer →';
    }
}

// Page de remerciement
function renderThankYou() {
    const container = document.getElementById('surveyContent');
    const thankYou = surveyData.thankYouMessage;
    
    container.innerHTML = `
        <div class="thank-you">
            <span class="thank-you-emoji">${thankYou.emoji}</span>
            <h2>${thankYou.title}</h2>
            <p>${thankYou.message}</p>
            <p style="margin-top: 2rem; color: var(--text-muted); font-size: 0.9rem;">
                ✅ Vos réponses ont été enregistrées avec succès !
            </p>
        </div>
    `;
    
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.querySelector('.progress-wrapper').style.display = 'none';
    
    // Sauvegarder dans les résultats globaux ET envoyer à Google Sheets
    saveToResults();
}

// Redémarrer le sondage
function restartSurvey() {
    if (confirm('Êtes-vous sûr de vouloir recommencer ? Vos réponses actuelles seront perdues.')) {
        responses = {};
        currentSectionIndex = 0;
        showingIntro = true;
        localStorage.removeItem('surveyResponses');
        
        if (surveyData.introduction) {
            renderIntroduction();
        } else {
            showingIntro = false;
            document.querySelector('.progress-wrapper').style.display = 'block';
            renderCurrentSection();
            updateProgress();
        }
        
        document.getElementById('nextBtn').style.display = 'inline-flex';
    }
}

// Afficher les résultats
function viewResults() {
    document.querySelector('.survey-container').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    renderResults();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Bouton suivant
    document.getElementById('nextBtn').addEventListener('click', function() {
        // Si on est sur l'introduction
        if (showingIntro) {
            showingIntro = false;
            document.querySelector('.progress-wrapper').style.display = 'block';
            renderCurrentSection();
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        collectCurrentResponses();
        
        if (!validateCurrentSection()) {
            return;
        }
        
        currentSectionIndex++;
        renderCurrentSection();
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Bouton précédent
    document.getElementById('prevBtn').addEventListener('click', function() {
        collectCurrentResponses();
        currentSectionIndex--;
        renderCurrentSection();
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Retour au sondage depuis les résultats
    document.getElementById('backToSurveyBtn').addEventListener('click', function() {
        document.getElementById('resultsContainer').style.display = 'none';
        document.querySelector('.survey-container').style.display = 'block';
    });
    
    // Délégation d'événements pour les checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const questionId = e.target.dataset.questionId;
            if (questionId) {
                updateCheckboxCounter(questionId);
            }
        }
    });
}
