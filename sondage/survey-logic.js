// ============================================
// CONFIGURATION GOOGLE SHEETS
// ============================================
// IMPORTANT : Remplacez cette URL par votre URL de déploiement Google Apps Script
// Pour obtenir cette URL, suivez le guide GUIDE-HEBERGEMENT-ET-DONNEES.md
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyqBJrzHlnOwTX8wELUO4m7DPYN_QNP7v8JX5c38EoiqrQRaBzpoxfafkoQDcizLn2S/exec';
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

// Enregistrer toutes les réponses dans un tableau persistant
function saveToResults() {
    const allResults = JSON.parse(localStorage.getItem('allSurveyResults') || '[]');
    
    const result = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        responses: { ...responses }
    };
    
    allResults.push(result);
    localStorage.setItem('allSurveyResults', JSON.stringify(allResults));
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
                <strong>💡 Votre partenaire d'improvisation virtuel :</strong><br><br>
                
                <strong>🎪 MAÎTRISE DES FORMATS</strong><br>
                • Connaît toutes les règles : match, Catch, Harold, Maestro, comparée...<br>
                • Joue tous les rôles : adversaire, binôme, coach, arbitre, public<br>
                • S'adapte au niveau : débutant, intermédiaire, compétiteur<br><br>
                
                <strong>🎭 TRAVAIL DU JEU</strong><br>
                • Vous challenge sur tous les personnages : du paysan à l'astronaute<br>
                • Teste votre écoute, votre acceptation, votre engagement<br>
                • Analyse votre présence scénique et vos choix de jeu<br><br>
                
                <strong>📖 PERFECTIONNEMENT NARRATIF</strong><br>
                • Décortique la structure de vos histoires (exposition, péripéties, résolution)<br>
                • Vous entraîne aux registres : comédie, drame, polar, fantastique...<br>
                • Identifie vos tics narratifs et vous aide à les dépasser<br><br>
                
                <strong>💼 APPLICATIONS PROFESSIONNELLES & PERSONNELLES</strong><br>
                • Préparez vos présentations, réunions ou entretiens importants<br>
                • Développez votre aisance relationnelle et votre répartie<br>
                • Gagnez en confiance pour toutes vos prises de parole<br><br>
                
                <strong>🧠 PROGRESSION CIBLÉE</strong><br>
                • Mémorise vos forces et axes d'amélioration<br>
                • Propose des exercices adaptés à vos objectifs<br>
                • Suit votre évolution technique session après session
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
    
    // Mettre à jour la progression de la section
    updateSectionProgress();
    
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

// Mettre à jour la progression de la section actuelle
function updateSectionProgress() {
    const section = surveyData.sections[currentSectionIndex];
    const sectionProgressDiv = document.getElementById('sectionProgress');
    
    if (!section) {
        sectionProgressDiv.style.display = 'none';
        return;
    }
    
    // Compter les questions obligatoires et répondues
    const requiredQuestions = section.questions.filter(q => q.required);
    const totalRequired = requiredQuestions.length;
    
    let answeredCount = 0;
    
    requiredQuestions.forEach(question => {
        if (question.type === 'radio' || question.type === 'scale') {
            const selected = document.querySelector(`input[name="${question.id}"]:checked`);
            if (selected) answeredCount++;
        } else if (question.type === 'checkbox') {
            const selected = document.querySelectorAll(`input[name="${question.id}"]:checked`);
            if (selected.length > 0) answeredCount++;
        } else if (question.type === 'text' || question.type === 'textarea') {
            const input = document.getElementById(question.id);
            if (input && input.value.trim()) answeredCount++;
        }
    });
    
    // Calculer le pourcentage
    const percentage = totalRequired > 0 ? Math.round((answeredCount / totalRequired) * 100) : 0;
    
    // Afficher la progression
    sectionProgressDiv.style.display = 'block';
    document.getElementById('answeredCount').textContent = answeredCount;
    document.getElementById('totalQuestions').textContent = totalRequired;
    document.getElementById('sectionProgressFill').style.width = `${percentage}%`;
    document.getElementById('sectionPercentage').textContent = `${percentage}%`;
    
    // Messages encourageants selon le pourcentage
    const statsElement = sectionProgressDiv.querySelector('.progress-stats span:first-child');
    if (percentage === 0) {
        statsElement.textContent = 'Commencez à répondre 🚀';
    } else if (percentage < 50) {
        statsElement.textContent = 'Continue, c\'est super ! 💪';
    } else if (percentage < 100) {
        statsElement.textContent = 'Plus que quelques questions ! 🎯';
    } else {
        statsElement.textContent = 'Section complète ! ✅';
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
            <button class="btn btn-primary" onclick="viewResults()">📊 Voir les résultats</button>
            <button class="btn btn-secondary" onclick="restartSurvey()" style="margin-top: 1rem;">🔄 Recommencer</button>
        </div>
    `;
    
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.querySelector('.progress-wrapper').style.display = 'none';
    
    // Sauvegarder dans les résultats globaux
    saveToResults();
}

// Redémarrer le sondage
function restartSurvey() {
    if (confirm('Êtes-vous sûr de vouloir recommencer ? Vos réponses actuelles seront perdues.')) {
        responses = {};
        currentSectionIndex = 0;
        localStorage.removeItem('surveyResponses');
        document.querySelector('.progress-wrapper').style.display = 'block';
        renderCurrentSection();
        updateProgress();
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
        
        // Mettre à jour la progression de la section en temps réel
        if (e.target.type === 'radio' || e.target.type === 'checkbox') {
            updateSectionProgress();
        }
    });
    
    // Mettre à jour la progression pour les champs texte
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('text-input') || e.target.classList.contains('textarea-input')) {
            updateSectionProgress();
        }
    });
}
