// Afficher les résultats et analyses
function renderResults() {
    const allResults = JSON.parse(localStorage.getItem('allSurveyResults') || '[]');
    const container = document.getElementById('resultsContent');
    
    if (allResults.length === 0) {
        container.innerHTML = `
            <div class="result-card">
                <p style="text-align: center; color: var(--text-muted);">
                    Aucune réponse enregistrée pour le moment.
                </p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="info-box">
            <strong>📊 Statistiques globales :</strong> ${allResults.length} réponse(s) enregistrée(s)
        </div>
    `;
    
    // Analyser chaque question
    surveyData.sections.forEach(section => {
        section.questions.forEach(question => {
            html += renderQuestionAnalysis(question, allResults);
        });
    });
    
    container.innerHTML = html;
}

// Analyser et afficher les résultats d'une question
function renderQuestionAnalysis(question, allResults) {
    const responses = allResults.map(r => r.responses[question.id]).filter(r => r !== undefined);
    
    if (responses.length === 0) {
        return '';
    }
    
    let html = `
        <div class="result-card">
            <h3 class="result-question">${question.label}</h3>
            <div class="result-stats">
    `;
    
    if (question.type === 'radio') {
        html += renderRadioAnalysis(question, responses);
    } else if (question.type === 'checkbox') {
        html += renderCheckboxAnalysis(question, responses);
    } else if (question.type === 'scale') {
        html += renderScaleAnalysis(question, responses);
    } else if (question.type === 'text' || question.type === 'textarea') {
        html += renderTextAnalysis(responses);
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Analyser les réponses radio
function renderRadioAnalysis(question, responses) {
    const counts = {};
    const total = responses.length;
    
    // Compter les réponses
    responses.forEach(response => {
        counts[response] = (counts[response] || 0) + 1;
    });
    
    let html = '';
    
    // Afficher les statistiques pour chaque option
    question.options.forEach(option => {
        const count = counts[option.value] || 0;
        const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
        
        html += `
            <div class="stat-bar">
                <div class="stat-label">
                    <span>${option.icon} ${option.text}</span>
                    <span><strong>${count}</strong> (${percentage}%)</span>
                </div>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${percentage}%">
                        ${percentage > 10 ? count : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

// Analyser les réponses checkbox
function renderCheckboxAnalysis(question, responses) {
    const counts = {};
    let total = 0;
    
    // Compter les réponses (chaque personne peut avoir plusieurs réponses)
    responses.forEach(response => {
        if (Array.isArray(response)) {
            response.forEach(value => {
                counts[value] = (counts[value] || 0) + 1;
                total++;
            });
        }
    });
    
    let html = '';
    
    // Afficher les statistiques pour chaque option
    question.options.forEach(option => {
        const count = counts[option.value] || 0;
        const percentage = responses.length > 0 ? (count / responses.length * 100).toFixed(1) : 0;
        
        html += `
            <div class="stat-bar">
                <div class="stat-label">
                    <span>${option.icon} ${option.text}</span>
                    <span><strong>${count}</strong> personnes (${percentage}%)</span>
                </div>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${percentage}%">
                        ${percentage > 10 ? count : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

// Analyser les réponses sur échelle
function renderScaleAnalysis(question, responses) {
    const counts = {};
    const total = responses.length;
    let sum = 0;
    
    // Compter et calculer la moyenne
    responses.forEach(response => {
        const value = parseInt(response);
        counts[value] = (counts[value] || 0) + 1;
        sum += value;
    });
    
    const average = total > 0 ? (sum / total).toFixed(2) : 0;
    
    let html = `
        <div class="info-box" style="margin-bottom: 1rem;">
            <strong>Moyenne :</strong> ${average} / ${question.scaleMax} 
            (${total} réponse${total > 1 ? 's' : ''})
        </div>
    `;
    
    // Afficher la distribution
    for (let i = question.scaleMin; i <= question.scaleMax; i++) {
        const count = counts[i] || 0;
        const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
        
        html += `
            <div class="stat-bar">
                <div class="stat-label">
                    <span>Note ${i}</span>
                    <span><strong>${count}</strong> (${percentage}%)</span>
                </div>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${percentage}%">
                        ${percentage > 10 ? count : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    return html;
}

// Analyser les réponses textuelles
function renderTextAnalysis(responses) {
    let html = '<div style="max-height: 300px; overflow-y: auto;">';
    
    responses.forEach((response, index) => {
        html += `
            <div style="padding: 0.75rem; background: var(--bg-primary); border-radius: var(--radius-sm); margin-bottom: 0.5rem; border-left: 3px solid var(--primary-color);">
                <strong>Réponse ${index + 1}:</strong><br>
                ${escapeHtml(response)}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Échapper le HTML pour éviter les injections
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exporter en CSV
document.getElementById('exportCSVBtn').addEventListener('click', function() {
    const allResults = JSON.parse(localStorage.getItem('allSurveyResults') || '[]');
    
    if (allResults.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    let csv = '';
    
    // En-têtes
    const headers = ['ID', 'Date'];
    surveyData.sections.forEach(section => {
        section.questions.forEach(question => {
            headers.push(question.label.replace(/,/g, ' '));
        });
    });
    csv += headers.join(',') + '\n';
    
    // Données
    allResults.forEach(result => {
        const row = [
            result.id,
            new Date(result.timestamp).toLocaleString('fr-FR')
        ];
        
        surveyData.sections.forEach(section => {
            section.questions.forEach(question => {
                const response = result.responses[question.id];
                if (Array.isArray(response)) {
                    row.push('"' + response.join('; ') + '"');
                } else if (response) {
                    row.push('"' + String(response).replace(/"/g, '""') + '"');
                } else {
                    row.push('');
                }
            });
        });
        
        csv += row.join(',') + '\n';
    });
    
    // Télécharger
    downloadFile(csv, 'resultats-sondage.csv', 'text/csv');
});

// Exporter en JSON
document.getElementById('exportJSONBtn').addEventListener('click', function() {
    const allResults = JSON.parse(localStorage.getItem('allSurveyResults') || '[]');
    
    if (allResults.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const json = JSON.stringify(allResults, null, 2);
    downloadFile(json, 'resultats-sondage.json', 'application/json');
});

// Fonction utilitaire pour télécharger un fichier
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Fonction pour réinitialiser toutes les données
function clearAllData() {
    if (confirm('⚠️ ATTENTION : Cette action supprimera TOUTES les réponses enregistrées. Êtes-vous sûr ?')) {
        localStorage.removeItem('allSurveyResults');
        localStorage.removeItem('surveyResponses');
        alert('Toutes les données ont été supprimées.');
        location.reload();
    }
}

// Ajouter un bouton de réinitialisation dans les résultats (optionnel)
if (document.getElementById('resultsContent')) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-secondary';
    clearBtn.style.marginTop = '1rem';
    clearBtn.innerHTML = '🗑️ Réinitialiser toutes les données';
    clearBtn.onclick = clearAllData;
    document.querySelector('.export-section').appendChild(clearBtn);
}
