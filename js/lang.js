/* ============================================
   lang.js — Système de traduction FR / EN
   ============================================ */

const TRANSLATIONS = {
    fr: {
        // Sidebar
        "nav.overview": "Vue d'ensemble",
        "nav.content": "Contenu",
        "nav.analytics": "Statistiques",
        "nav.comments": "Commentaires",
        "nav.calendar": "Calendrier",
        "nav.settings": "Paramètres",
        "api.disconnected": "API non connectée",
        "api.connected": "API connectée",

        // Channel
        "channel.name": "Ma Chaîne",
        "channel.handle": "@machaîne",

        // Locked state
        "locked.title": "Connectez-vous pour voir vos statistiques",
        "locked.desc": "Connectez votre clé API YouTube dans les paramètres pour charger et analyser les données en direct de votre chaîne.",
        "locked.button": "Se connecter à l'API",

        // Overview
        "overview.title": "Vue d'ensemble de la chaîne",
        "period.7": "7 derniers jours",
        "period.28": "28 derniers jours",
        "period.90": "90 derniers jours",
        "period.365": "12 derniers mois",

        // Stats
        "stat.views": "Vues",
        "stat.subscribers": "Abonnés",
        "stat.watchtime": "Temps de visionnage",
        "stat.revenue": "Revenus estimés",

        // Chart
        "chart.title": "Performances",
        "chart.views": "Vues",
        "chart.subscribers": "Abonnés",
        "chart.watchtime": "Temps de visionnage",

        "suffix.views": " vues",
        "suffix.subscribers": " abonnés",
        "suffix.watchtime": " heures",

        // Videos
        "videos.title": "Dernières vidéos",
        "status.public": "Publique",
        "status.private": "Privée",
        "status.unlisted": "Non répertoriée",

        // Content page
        "content.title": "Contenu de la chaîne",
        "content.sort.date": "Date (récentes)",
        "content.sort.views": "Vues",
        "content.sort.likes": "Likes",

        // Analytics page
        "analytics.title": "Statistiques détaillées",
        "analytics.top": "Meilleures vidéos",
        "analytics.avgViews": "Vues moyennes",
        "analytics.avgLikes": "Likes moyens",
        "analytics.totalComments": "Total commentaires",
        "analytics.engagement": "Taux d'engagement",

        // Comments page
        "comments.title": "Commentaires",
        "comments.placeholder": "Les commentaires de vos vidéos apparaîtront ici une fois l'API YouTube connectée.",
        "comments.connect": "Connecter l'API",
        "comments.sample": "Aperçu avec données de démonstration",
        "comments.sample1.author": "TechFan42",
        "comments.sample1.text": "Super vidéo ! J'ai appris plein de choses, merci 🙌",
        "comments.sample2.author": "CodeurPro",
        "comments.sample2.text": "Est-ce que tu pourrais faire un tuto plus détaillé sur la partie API ?",
        "comments.sample3.author": "MarieDevWeb",
        "comments.sample3.text": "Très bien expliqué, même pour un débutant. Abonnée !",
        "comments.ago.hours": "il y a {n} heures",
        "comments.ago.days": "il y a {n} jours",

        // Calendar page
        "calendar.title": "Calendrier & Programmation",
        "calendar.add": "Ajouter un événement",
        "calendar.upcoming": "Prochains événements & rappels",
        "calendar.noEvents": "Aucun événement à venir. Cliquez sur un jour du calendrier ou sur 'Ajouter un événement'.",
        "calendar.newEvent": "Nouvel événement / rappel",
        "calendar.eventTitle": "Titre",
        "calendar.eventTitle.placeholder": "Ex: Tournage vidéo #12 ou Publication Shorts",
        "calendar.eventDate": "Date",
        "calendar.eventTime": "Heure (optionnel)",
        "calendar.eventType": "Type",
        "calendar.type.publication": "📹 Publication vidéo",
        "calendar.type.reminder": "🔔 Rappel",
        "calendar.type.note": "📝 Note / Idée",
        "calendar.eventNotes": "Notes / Description",
        "calendar.eventNotes.placeholder": "Détails, liens, matériel nécessaire...",
        "calendar.cancel": "Annuler",
        "calendar.save": "Enregistrer",
        "calendar.delete": "Supprimer",
        "calendar.today": "Aujourd'hui",
        "calendar.days.mon": "Lun",
        "calendar.days.tue": "Mar",
        "calendar.days.wed": "Mer",
        "calendar.days.thu": "Jeu",
        "calendar.days.fri": "Ven",
        "calendar.days.sat": "Sam",
        "calendar.days.sun": "Dim",

        // Settings page
        "settings.title": "Paramètres",
        "settings.appearance": "Apparence",
        "settings.theme": "Thème",
        "settings.theme.light": "Clair",
        "settings.theme.dark": "Sombre",
        "settings.theme.desc": "Choisissez l'apparence de l'interface",
        "settings.language": "Langue",
        "settings.language.desc": "Choisissez la langue de l'interface",
        "settings.api": "API YouTube",
        "settings.api.title": "Connexion API YouTube",
        "settings.api.desc": "Connectez votre clé API pour charger automatiquement les statistiques et vidéos réelles de votre chaîne.",
        "settings.api.key": "Clé API (YouTube Data API v3)",
        "settings.api.key.placeholder": "Ex: AIzaSyD-xxxxxxxxxxxxxxxxxxxxx",
        "settings.api.channel": "Identifiant de la chaîne (ou Handle @)",
        "settings.api.channel.placeholder": "Ex: UC_x5XG1OV2P6uZZ5FSM9Ttw ou @machaîne",
        "settings.api.save": "Tester et connecter",
        "settings.api.disconnect": "Déconnecter la chaîne",
        "settings.api.status.disconnected": "Statut : Déconnecté (aucune chaîne active)",
        "settings.api.status.connected": "Statut : Connecté à {channel}",
        "settings.api.help.btn": "Besoin d'aide ? Comment obtenir ma clé API et mon ID ?",
        "settings.saved": "✓ Paramètres sauvegardés",
        "settings.about": "À propos",
        "settings.about.desc": "YouTube Dashboard est une application locale pour consulter les statistiques et planifier le contenu de votre chaîne.",
        "settings.reset.title": "Zone de réinitialisation",
        "settings.reset.label": "Effacer toutes les données",
        "settings.reset.desc": "Supprime la clé API, la chaîne enregistrée, les événements du calendrier et remet les réglages par défaut.",
        "settings.reset.btn": "Réinitialiser l'application",
        "settings.reset.confirm": "⚠️ Êtes-vous sûr de vouloir tout réinitialiser ? Toutes vos données (clé API, calendrier, etc.) seront effacées.",

        // API errors and status
        "api.status.checking": "Vérification en cours auprès de Google...",
        "api.success": "✓ Connexion réussie à la chaîne : {channel}",
        "api.disconnected.msg": "Chaîne déconnectée avec succès.",
        "api.error.missing_key": "Veuillez entrer une clé API YouTube.",
        "api.error.missing_channel": "Veuillez entrer l'ID de votre chaîne ou votre @handle.",
        "api.error.invalid_key": "❌ Clé API invalide. Vérifiez que vous avez bien copié votre clé Google Cloud.",
        "api.error.not_enabled": "❌ La bibliothèque 'YouTube Data API v3' n'est pas activée sur votre projet Google Cloud.",
        "api.error.not_found": "❌ Chaîne introuvable. Vérifiez l'ID de chaîne (UC...) ou votre @pseudo.",
        "api.error.quota": "❌ Quota journalier de l'API YouTube dépassé.",
        "api.error.network": "❌ Impossible de contacter les serveurs Google. Vérifiez votre connexion Internet.",
        "api.error.generic": "❌ Erreur lors de la connexion API.",

        // Tutorial Modal
        "tutorial.title": "Comment obtenir votre clé API YouTube ?",
        "tutorial.subtitle": "Suivez ces 4 étapes simples et 100% gratuites :",
        "tutorial.step1.title": "Étape 1 : Créer un projet Google Cloud",
        "tutorial.step1.desc": "Rendez-vous sur la console Google Cloud :",
        "tutorial.step1.link": "console.cloud.google.com",
        "tutorial.step1.sub": "Connectez-vous avec votre compte Google et cliquez sur 'Nouveau projet' (nommez-le par exemple 'Mon YouTube Dashboard').",
        "tutorial.step2.title": "Étape 2 : Activer la bibliothèque YouTube API",
        "tutorial.step2.desc": "Dans le menu à gauche, allez dans <strong>API et services > Bibliothèque</strong>. Recherchez <code>YouTube Data API v3</code> et cliquez sur <strong>Activer</strong>.",
        "tutorial.step3.title": "Étape 3 : Créer votre clé API",
        "tutorial.step3.desc": "Allez dans <strong>API et services > Identifiants</strong>. Cliquez sur <strong>+ Créer des identifiants</strong> en haut, puis sélectionnez <strong>Clé API</strong>. Copiez la clé qui commence par <code>AIza...</code>.",
        "tutorial.step4.title": "Étape 4 : Trouver l'ID de votre chaîne",
        "tutorial.step4.desc": "Allez sur <strong>studio.youtube.com</strong>, cliquez sur <strong>Paramètres > Chaîne > Paramètres avancés</strong> (ou <code>youtube.com/account_advanced</code>). Copiez l'<strong>Identifiant de chaîne</strong> (commence par <code>UC...</code>). Vous pouvez aussi simplement utiliser votre identifiant avec <code>@</code> (ex: <code>@machaîne</code>) !",
        "tutorial.security": "🔒 <strong>Sécurité locale :</strong> Vos identifiants restent stockés exclusivement dans votre navigateur local. Aucune donnée n'est transmise à un serveur tiers.",
        "tutorial.close": "J'ai compris, fermer"
    },
    en: {
        // Sidebar
        "nav.overview": "Overview",
        "nav.content": "Content",
        "nav.analytics": "Analytics",
        "nav.comments": "Comments",
        "nav.calendar": "Calendar",
        "nav.settings": "Settings",
        "api.disconnected": "API not connected",
        "api.connected": "API connected",

        // Channel
        "channel.name": "My Channel",
        "channel.handle": "@mychannel",

        // Locked state
        "locked.title": "Sign in to see your statistics",
        "locked.desc": "Connect your YouTube API key in settings to load and view your channel's real data.",
        "locked.button": "Connect to API",

        // Overview
        "overview.title": "Channel overview",
        "period.7": "Last 7 days",
        "period.28": "Last 28 days",
        "period.90": "Last 90 days",
        "period.365": "Last 12 months",

        // Stats
        "stat.views": "Views",
        "stat.subscribers": "Subscribers",
        "stat.watchtime": "Watch time",
        "stat.revenue": "Estimated revenue",

        // Chart
        "chart.title": "Performance",
        "chart.views": "Views",
        "chart.subscribers": "Subscribers",
        "chart.watchtime": "Watch time",

        "suffix.views": " views",
        "suffix.subscribers": " subscribers",
        "suffix.watchtime": " hours",

        // Videos
        "videos.title": "Latest videos",
        "status.public": "Public",
        "status.private": "Private",
        "status.unlisted": "Unlisted",

        // Content page
        "content.title": "Channel content",
        "content.sort.date": "Date (newest)",
        "content.sort.views": "Views",
        "content.sort.likes": "Likes",

        // Analytics page
        "analytics.title": "Detailed analytics",
        "analytics.top": "Top videos",
        "analytics.avgViews": "Average views",
        "analytics.avgLikes": "Average likes",
        "analytics.totalComments": "Total comments",
        "analytics.engagement": "Engagement rate",

        // Comments page
        "comments.title": "Comments",
        "comments.placeholder": "Your video comments will appear here once the YouTube API is connected.",
        "comments.connect": "Connect API",
        "comments.sample": "Preview with demo data",
        "comments.sample1.author": "TechFan42",
        "comments.sample1.text": "Great video! Learned so much, thanks 🙌",
        "comments.sample2.author": "ProCoder",
        "comments.sample2.text": "Could you make a more detailed tutorial about the API part?",
        "comments.sample3.author": "MarieWebDev",
        "comments.sample3.text": "Very well explained, even for a beginner. Subscribed!",
        "comments.ago.hours": "{n} hours ago",
        "comments.ago.days": "{n} days ago",

        // Calendar page
        "calendar.title": "Calendar & Planning",
        "calendar.add": "Add event",
        "calendar.upcoming": "Upcoming events & reminders",
        "calendar.noEvents": "No upcoming events. Click on a calendar day or click 'Add event'.",
        "calendar.newEvent": "New event / reminder",
        "calendar.eventTitle": "Title",
        "calendar.eventTitle.placeholder": "E.g.: Video #12 recording or Shorts release",
        "calendar.eventDate": "Date",
        "calendar.eventTime": "Time (optional)",
        "calendar.eventType": "Type",
        "calendar.type.publication": "📹 Video publication",
        "calendar.type.reminder": "🔔 Reminder",
        "calendar.type.note": "📝 Note / Idea",
        "calendar.eventNotes": "Notes / Description",
        "calendar.eventNotes.placeholder": "Details, links, checklist...",
        "calendar.cancel": "Cancel",
        "calendar.save": "Save",
        "calendar.delete": "Delete",
        "calendar.today": "Today",
        "calendar.days.mon": "Mon",
        "calendar.days.tue": "Tue",
        "calendar.days.wed": "Wed",
        "calendar.days.thu": "Thu",
        "calendar.days.fri": "Fri",
        "calendar.days.sat": "Sat",
        "calendar.days.sun": "Sun",

        // Settings page
        "settings.title": "Settings",
        "settings.appearance": "Appearance",
        "settings.theme": "Theme",
        "settings.theme.light": "Light",
        "settings.theme.dark": "Dark",
        "settings.theme.desc": "Choose the interface appearance",
        "settings.language": "Language",
        "settings.language.desc": "Choose the interface language",
        "settings.api": "YouTube API",
        "settings.api.title": "YouTube API Connection",
        "settings.api.desc": "Connect your API key to automatically load real statistics and videos from your channel.",
        "settings.api.key": "API Key (YouTube Data API v3)",
        "settings.api.key.placeholder": "E.g.: AIzaSyD-xxxxxxxxxxxxxxxxxxxxx",
        "settings.api.channel": "Channel ID (or @handle)",
        "settings.api.channel.placeholder": "E.g.: UC_x5XG1OV2P6uZZ5FSM9Ttw or @mychannel",
        "settings.api.save": "Test & Connect",
        "settings.api.disconnect": "Disconnect channel",
        "settings.api.status.disconnected": "Status: Disconnected (no channel active)",
        "settings.api.status.connected": "Status: Connected to {channel}",
        "settings.api.help.btn": "Need help? How to get my API key and Channel ID?",
        "settings.saved": "✓ Settings saved",
        "settings.about": "About",
        "settings.about.desc": "YouTube Dashboard is a local application to monitor statistics and plan channel content.",
        "settings.reset.title": "Reset Zone",
        "settings.reset.label": "Clear all data",
        "settings.reset.desc": "Removes the API key, connected channel, calendar events and restores default settings.",
        "settings.reset.btn": "Reset Application",
        "settings.reset.confirm": "⚠️ Are you sure you want to reset everything? All data (API key, calendar events, etc.) will be permanently erased.",

        // API errors and status
        "api.status.checking": "Verifying with Google servers...",
        "api.success": "✓ Successfully connected to channel: {channel}",
        "api.disconnected.msg": "Channel disconnected successfully.",
        "api.error.missing_key": "Please enter a YouTube API key.",
        "api.error.missing_channel": "Please enter your Channel ID or @handle.",
        "api.error.invalid_key": "❌ Invalid API key. Make sure you copied your key correctly from Google Cloud.",
        "api.error.not_enabled": "❌ The 'YouTube Data API v3' library is not enabled on your Google Cloud project.",
        "api.error.not_found": "❌ Channel not found. Check the Channel ID (UC...) or your @handle.",
        "api.error.quota": "❌ YouTube API daily quota exceeded.",
        "api.error.network": "❌ Cannot reach Google servers. Check your internet connection.",
        "api.error.generic": "❌ Error during API connection.",

        // Tutorial Modal
        "tutorial.title": "How to get your YouTube API key?",
        "tutorial.subtitle": "Follow these 4 simple and 100% free steps:",
        "tutorial.step1.title": "Step 1: Create a Google Cloud project",
        "tutorial.step1.desc": "Go to the Google Cloud Console:",
        "tutorial.step1.link": "console.cloud.google.com",
        "tutorial.step1.sub": "Sign in with your Google account and click 'New Project' (e.g. name it 'My YouTube Dashboard').",
        "tutorial.step2.title": "Step 2: Enable the YouTube API library",
        "tutorial.step2.desc": "In the left menu, go to <strong>APIs & Services > Library</strong>. Search for <code>YouTube Data API v3</code> and click <strong>Enable</strong>.",
        "tutorial.step3.title": "Step 3: Create your API key",
        "tutorial.step3.desc": "Go to <strong>APIs & Services > Credentials</strong>. Click <strong>+ Create Credentials</strong> at the top, then select <strong>API key</strong>. Copy the key starting with <code>AIza...</code>.",
        "tutorial.step4.title": "Step 4: Find your Channel ID",
        "tutorial.step4.desc": "Go to <strong>studio.youtube.com</strong>, click <strong>Settings > Channel > Advanced settings</strong> (or <code>youtube.com/account_advanced</code>). Copy the <strong>Channel ID</strong> (starts with <code>UC...</code>). You can also simply use your handle with <code>@</code> (e.g. <code>@mychannel</code>)!",
        "tutorial.security": "🔒 <strong>Local Security:</strong> Your credentials are kept exclusively in your local browser. No data is sent to third-party servers.",
        "tutorial.close": "Got it, close"
    }
};

function t(key, params = {}) {
    const lang = Settings.get('language') || 'fr';
    let text = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS['fr'] && TRANSLATIONS['fr'][key]) || key;
    
    // Remplacement de variables {var}
    for (const p in params) {
        text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    }
    return text;
}

function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerHTML = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-options]').forEach(select => {
        const prefix = select.getAttribute('data-i18n-options');
        select.querySelectorAll('option').forEach(opt => {
            const key = prefix + '.' + opt.value;
            const lang = Settings.get('language') || 'fr';
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                opt.textContent = t(key);
            }
        });
    });
}
