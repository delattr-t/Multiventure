// Configuration du sondage - Agent IA Spécialisé Improvisation
const surveyData = {
    title: "Votre coach IA d'impro - Aidez-nous à le créer !",
    introduction: {
        title: "Bonjour !",
        text: "Nous menons une étude sur les méthodes d'entraînement et les outils utilisés par les pratiquants d'improvisation théâtrale. Votre retour anonyme nous aide à mieux comprendre les besoins actuels et futurs de cette communauté.",
        duration: "Durée : 1-2 minutes"
    },
    sections: [
        {
            id: 1,
            emoji: "👤",
            title: "Votre Profil",
            description: "Quelques questions pour mieux vous connaître",
            questions: [
                {
                    id: "q1",
                    label: "Quelle est votre MOTIVATION PRINCIPALE pour répondre à ce questionnaire ?",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "pratique-impro", icon: "🎭", text: "Je pratique l'improvisation théâtrale (club, cours, compétitions)" },
                        { value: "dev-pro", icon: "💼", text: "Je cherche à développer mes compétences professionnelles (prise de parole, gestion de l'imprévu)" },
                        { value: "enseignant", icon: "👨‍🏫", text: "J'enseigne/coache l'improvisation ou le développement personnel" },
                        { value: "curiosite", icon: "🤔", text: "Simple curiosité pour les outils IA" },
                        { value: "autre", icon: "✨", text: "Autre" }
                    ]
                },
                {
                    id: "q2",
                    label: "Vous pratiquez l'improvisation théâtrale actuellement ?",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "regulier", icon: "🎭", text: "Oui, régulièrement (1+ fois/semaine)" },
                        { value: "occasionnel", icon: "🎪", text: "Oui, occasionnellement (1-3 fois/mois)" },
                        { value: "veux-commencer", icon: "🌱", text: "Non, mais j'aimerais commencer" },
                        { value: "pas-interet", icon: "❌", text: "Non, pas d'intérêt pour l'impro" }
                    ]
                },
                {
                    id: "q3",
                    label: "Âge :",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "moins-18", icon: "🧒", text: "Moins de 18 ans" },
                        { value: "18-24", icon: "🎓", text: "18-24 ans" },
                        { value: "25-34", icon: "💼", text: "25-34 ans" },
                        { value: "35-44", icon: "👔", text: "35-44 ans" },
                        { value: "45-54", icon: "🎯", text: "45-54 ans" },
                        { value: "55-plus", icon: "🌟", text: "55+ ans" }
                    ]
                }
            ]
        },
        {
            id: 2,
            emoji: "🤖",
            title: "Votre Expérience avec l'IA",
            description: "Pour l'impro et le développement personnel",
            questions: [
                {
                    id: "q4",
                    label: "Utilisez-vous des IA (ChatGPT, Character.ai, etc.) pour l'impro ou le développement personnel ?",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "regulier", icon: "✅", text: "Oui, régulièrement (1+ fois/semaine)" },
                        { value: "occasionnel", icon: "👍", text: "Oui, occasionnellement" },
                        { value: "teste-abandonne", icon: "🤔", text: "J'ai testé mais n'utilise plus" },
                        { value: "jamais", icon: "❌", text: "Jamais utilisé" }
                    ]
                },
                {
                    id: "q5",
                    label: "SI OUI - Pour quels usages précis ? (choisir jusqu'à 3)",
                    type: "checkbox",
                    required: false,
                    maxChoices: 3,
                    options: [
                        { value: "idees-scenarios", icon: "💡", text: "Générer des idées/scénarios d'impro" },
                        { value: "dialogues", icon: "💬", text: "Simuler des dialogues/conversations/personnages" },
                        { value: "feedbacks", icon: "📝", text: "Recevoir des feedbacks sur mes textes" },
                        { value: "exercices", icon: "🏋️", text: "Créer des exercices personnalisés" },
                        { value: "techniques", icon: "📚", text: "Apprendre des techniques" },
                        { value: "entretiens", icon: "🎤", text: "Préparer des entretiens/présentations" },
                        { value: "autre", icon: "✨", text: "Autre" }
                    ]
                },
                {
                    id: "q6",
                    label: "Sur une échelle de 1 à 10, à quel point êtes-vous satisfait(e) de votre utilisation actuelle des IA pour l'impro/dev perso ?",
                    type: "scale",
                    required: false,
                    scaleMin: 1,
                    scaleMax: 10,
                    scaleLegends: {
                        min: "Très insatisfait",
                        max: "Extrêmement satisfait"
                    }
                },
                {
                    id: "q7",
                    label: "Quels sont les 3 plus gros problèmes rencontrés ?",
                    type: "checkbox",
                    required: false,
                    maxChoices: 3,
                    options: [
                        { value: "generique", icon: "😐", text: "Réponses trop génériques/sans personnalité" },
                        { value: "regles", icon: "📋", text: "Ne comprend pas les règles spécifiques de l'impro" },
                        { value: "memoire", icon: "🧠", text: "Oublie le contexte rapidement" },
                        { value: "creativite", icon: "🎨", text: "Manque de créativité/répétitif" },
                        { value: "feedback", icon: "📉", text: "Feedback peu pertinent ou superficiel" },
                        { value: "guidage", icon: "🎯", text: "Difficile à 'guider' pour un jeu spécifique" },
                        { value: "autre", icon: "✨", text: "Autre" }
                    ]
                },
                {
                    id: "q7bis",
                    label: "En une phrase, qu'est-ce qui vous manque le PLUS dans votre usage actuel ?",
                    type: "text",
                    required: false,
                    placeholder: "Ex: feedbacks plus précis, mémoire des sessions, compréhension des règles..."
                },
                {
                    id: "q8",
                    label: "SI JAMAIS UTILISÉ - Pourquoi ?",
                    type: "radio",
                    required: false,
                    options: [
                        { value: "sais-pas", icon: "🤷", text: "Je ne sais pas comment m'y prendre" },
                        { value: "pas-interet", icon: "🚫", text: "Je ne vois pas l'intérêt pour l'impro" },
                        { value: "prefere-humain", icon: "👥", text: "Je préfère les interactions humaines" },
                        { value: "sceptique", icon: "🤨", text: "Je suis sceptique sur la qualité" },
                        { value: "autre", icon: "✨", text: "Autre" }
                    ]
                }
            ]
        },
        {
            id: 3,
            emoji: "🎯",
            title: "Vos Besoins et Difficultés",
            description: "Quels sont vos défis en improvisation ?",
            questions: [
                {
                    id: "q9",
                    label: "Quels sont vos 3 plus grands défis en improvisation ?",
                    type: "checkbox",
                    required: true,
                    maxChoices: 3,
                    options: [
                        { value: "partenaire", icon: "👥", text: "Manque de partenaire d'entraînement régulier" },
                        { value: "feedback", icon: "📝", text: "Feedback insuffisant ou peu constructif" },
                        { value: "idees", icon: "💡", text: "Difficulté à générer des idées originales" },
                        { value: "stress", icon: "😰", text: "Stress en situation imprévue" },
                        { value: "progression", icon: "📈", text: "Progression lente sans accompagnement" },
                        { value: "cout", icon: "💰", text: "Coût des cours/coaching" },
                        { value: "temps", icon: "⏰", text: "Manque de temps pour pratiquer" },
                        { value: "autre", icon: "✨", text: "Autre" }
                    ]
                },
                {
                    id: "q10",
                    label: "Sur une échelle de 1 à 10, votre besoin d'un outil d'entraînement accessible ?",
                    type: "scale",
                    required: true,
                    scaleMin: 1,
                    scaleMax: 10,
                    scaleLegends: {
                        min: "Aucun besoin",
                        max: "Besoin urgent"
                    }
                }
            ]
        },
        {
            id: 4,
            emoji: "🚀",
            title: "Concept Agent IA Spécialisé",
            description: "Un agent IA entièrement dédié à l'improvisation théâtrale",
            questions: [
                {
                    id: "q11",
                    label: "Ce concept vous semble-t-il utile pour votre pratique ?",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "tres-utile", icon: "⭐", text: "Très utile, je l'utiliserais régulièrement" },
                        { value: "assez-utile", icon: "👍", text: "Assez utile, je testerais volontiers" },
                        { value: "peu-utile", icon: "🤔", text: "Peu utile, je préfère d'autres solutions" },
                        { value: "pas-utile", icon: "❌", text: "Pas utile pour moi" }
                    ]
                },
                {
                    id: "q12",
                    label: "Quelles fonctionnalités seraient ESSENTIELLES ? (choisir 3)",
                    type: "checkbox",
                    required: true,
                    maxChoices: 3,
                    options: [
                        { value: "regles", icon: "📋", text: "Compréhension des règles d'impro spécifiques" },
                        { value: "memoire", icon: "🧠", text: "Mémoire de nos sessions précédentes" },
                        { value: "feedback-structure", icon: "📝", text: "Feedback détaillé sur la structure narrative" },
                        { value: "personnages", icon: "🎭", text: "Capacité à jouer différents personnages/styles" },
                        { value: "exercices", icon: "🏋️", text: "Exercices progressifs adaptés à mon niveau" },
                        { value: "analyse", icon: "📊", text: "Analyse de mes forces/faiblesses" },
                        { value: "simulations", icon: "🎤", text: "Simulations d'entretiens/prises de parole" },
                        { value: "autre", icon: "✨", text: "Autre" }
                    ]
                },
                {
                    id: "q13",
                    label: "Si vous aviez accès à cet outil DÈS AUJOURD'HUI, combien de temps par SEMAINE seriez-vous prêt(e) à y consacrer ?",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "moins-15min", icon: "⏱️", text: "Moins de 15 minutes/semaine" },
                        { value: "15-30min", icon: "⏰", text: "15-30 minutes/semaine" },
                        { value: "30min-1h", icon: "🕐", text: "30 minutes - 1 heure/semaine" },
                        { value: "1-2h", icon: "🕑", text: "1-2 heures/semaine" },
                        { value: "plus-2h", icon: "🕒", text: "Plus de 2 heures/semaine" },
                        { value: "pas-utiliser", icon: "❌", text: "Je ne l'utiliserais pas" }
                    ]
                }
            ]
        },
        {
            id: 5,
            emoji: "💰",
            title: "Monétisation et Engagement",
            description: "Aidez-nous à définir le bon modèle",
            questions: [
                {
                    id: "q14",
                    label: "Quel modèle préféreriez-vous ?",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "gratuit", icon: "🆓", text: "Gratuit avec limitations" },
                        { value: "freemium", icon: "⚡", text: "Freemium (basique gratuit, premium payant)" },
                        { value: "mensuel", icon: "📅", text: "Abonnement mensuel (5-20€)" },
                        { value: "annuel", icon: "📆", text: "Abonnement annuel (économique)" },
                        { value: "seance", icon: "🎫", text: "Paiement à la séance" },
                        { value: "pas-payer", icon: "❌", text: "Je ne paierais pas" }
                    ]
                },
                {
                    id: "q15",
                    label: "Si cette IA spécialisée vous apportait une réelle valeur ajoutée par rapport à ChatGPT (feedbacks précis, mémoire de vos sessions, exercices adaptés), quel prix mensuel maximum seriez-vous prêt à payer ?",
                    type: "radio",
                    required: true,
                    options: [
                        { value: "0", icon: "🆓", text: "0€ (je resterais sur des solutions gratuites)" },
                        { value: "5-9", icon: "💵", text: "5-9€/mois" },
                        { value: "10-14", icon: "💶", text: "10-14€/mois" },
                        { value: "15-19", icon: "💷", text: "15-19€/mois" },
                        { value: "20-24", icon: "💸", text: "20-24€/mois" },
                        { value: "25-plus", icon: "💰", text: "25€+/mois" },
                        { value: "sais-pas", icon: "🤷", text: "Je ne sais pas encore" }
                    ]
                }
            ]
        },
        {
            id: 6,
            emoji: "📬",
            title: "Restons en Contact",
            description: "Pour participer à la suite de l'aventure",
            questions: [
                {
                    id: "q16",
                    label: "Seriez-vous intéressé(e) pour tester notre solution en avant-première ?",
                    type: "radio",
                    required: false,
                    options: [
                        { value: "oui-tester", icon: "✅", text: "Oui, je serais ravi(e) de tester !" },
                        { value: "informer", icon: "📧", text: "Juste me tenir informé(e)" },
                        { value: "non", icon: "❌", text: "Non merci" }
                    ]
                },
                {
                    id: "q17",
                    label: "Votre email (pour recevoir le guide + les actualités)",
                    type: "text",
                    required: false,
                    placeholder: "votre@email.com"
                }
            ]
        }
    ],
    thankYouMessage: {
        emoji: "🎉",
        title: "Merci infiniment !",
        message: "Vos réponses sont précieuses et nous aideront à créer un agent IA vraiment adapté aux besoins des improvisateurs. Si vous avez laissé votre email, vous serez informé(e) en priorité du lancement !"
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = surveyData;
}
