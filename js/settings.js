/* ============================================
   settings.js — Gestion des préférences
   
   Sauvegarde les préférences dans localStorage
   pour qu'elles persistent entre les sessions.
   ============================================ */

const Settings = {
    _prefix: 'ytdash_',

    defaults: {
        theme: 'light',
        language: 'fr',
        apiKey: '',
        channelId: '',
    },

    /**
     * Récupère une valeur de paramètre.
     */
    get(key) {
        try {
            const stored = localStorage.getItem(this._prefix + key);
            return stored !== null ? stored : this.defaults[key];
        } catch (e) {
            return this.defaults[key];
        }
    },

    /**
     * Enregistre une valeur de paramètre.
     */
    set(key, value) {
        try {
            localStorage.setItem(this._prefix + key, value);
        } catch (e) {
            console.warn('Impossible de sauvegarder le paramètre :', key);
        }
    },

    /**
     * Récupère tous les paramètres.
     */
    getAll() {
        const settings = {};
        for (const key in this.defaults) {
            settings[key] = this.get(key);
        }
        return settings;
    },

    /**
     * Applique le thème (clair ou sombre).
     */
    applyTheme(theme) {
        if (!theme) theme = this.get('theme');
        document.documentElement.setAttribute('data-theme', theme);
        this.set('theme', theme);

        // Met à jour le bouton actif dans les paramètres
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Redessine le graphique si nécessaire
        if (typeof updateChartTheme === 'function') {
            updateChartTheme();
        }
    },

    /**
     * Applique la langue.
     */
    applyLanguage(lang) {
        if (!lang) lang = this.get('language');
        document.documentElement.setAttribute('lang', lang);
        this.set('language', lang);

        // Met à jour le sélecteur actif
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Traduit toute la page
        if (typeof translatePage === 'function') {
            translatePage();
        }

        // Re-render les sections dynamiques
        if (typeof initStats === 'function') initStats();
        if (typeof initVideos === 'function') initVideos();
        if (typeof initContentPage === 'function') initContentPage();
        if (typeof initAnalyticsPage === 'function') initAnalyticsPage();
        if (typeof initCommentsPage === 'function') initCommentsPage();
        if (typeof renderChart === 'function') {
            const activeTab = document.querySelector('.chart-tab.active');
            const metric = activeTab ? activeTab.dataset.metric : 'views';
            renderChart(metric);
        }
    },

    /**
     * Initialise les paramètres au démarrage.
     */
    init() {
        this.applyTheme();
        this.applyLanguage();
    }
};
