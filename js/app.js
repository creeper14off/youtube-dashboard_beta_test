/* ============================================
   app.js — Logique principale de l'application
   
   Navigation, synchronisation API YouTube,
   gestion du mode verrouillé et interactions.
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialiser les préférences de l'utilisateur
    Settings.init();

    // 2. Initialiser le calendrier
    if (typeof Calendar !== 'undefined') {
        Calendar.init();
    }

    // 3. Tenter de connecter l'API si des identifiants sont enregistrés
    await YouTubeAPI.init();

    // 4. Initialiser l'interface selon l'état de connexion
    updateConnectionUI();

    // 5. Initialiser les événements et composants
    initNavigation();
    initSidebar();
    initSettingsPage();
    initApiHelpModal();
    initPeriodSelector();

    // 6. Traduire l'ensemble des éléments
    translatePage();
});


/* ===========================================
   GESTION DE L'ÉTAT CONNECTÉ / VERROUILLÉ
   =========================================== */
function updateConnectionUI() {
    const isConnected = YouTubeAPI.isConnected();
    const appBody = document.body;

    if (isConnected) {
        appBody.classList.remove('api-locked');
        appBody.classList.add('api-connected');

        // Mettre à jour l'info de la chaîne dans la sidebar
        updateSidebarChannel(YouTubeAPI.channelData);

        // Mettre à jour le badge de statut
        updateApiStatusBadge(true, YouTubeAPI.channelData.title);

        // Remplir les données réelles
        loadRealData();
    } else {
        appBody.classList.add('api-locked');
        appBody.classList.remove('api-connected');

        // Remettre les infos par défaut dans la sidebar
        resetSidebarChannel();

        // Mettre à jour le badge de statut
        updateApiStatusBadge(false);

        // Afficher l'état verrouillé (pas de fausses stats)
        renderLockedState();
    }
}

/**
 * Met à jour le profil de chaîne dans la sidebar
 */
function updateSidebarChannel(channel) {
    const avatarEl = document.querySelector('.channel-avatar');
    const nameEl = document.querySelector('.channel-name');
    const handleEl = document.querySelector('.channel-handle');

    if (avatarEl && channel.avatar) {
        avatarEl.innerHTML = `<img src="${channel.avatar}" alt="${channel.title}" class="channel-avatar-img">`;
    }
    if (nameEl) nameEl.textContent = channel.title;
    if (handleEl) handleEl.textContent = channel.handle;
}

function resetSidebarChannel() {
    const avatarEl = document.querySelector('.channel-avatar');
    const nameEl = document.querySelector('.channel-name');
    const handleEl = document.querySelector('.channel-handle');

    if (avatarEl) avatarEl.innerHTML = 'YT';
    if (nameEl) nameEl.textContent = t('channel.name');
    if (handleEl) handleEl.textContent = t('channel.handle');
}

/**
 * Met à jour le badge de statut API dans la sidebar
 */
function updateApiStatusBadge(connected, channelName = '') {
    const sidebarStatus = document.getElementById('apiStatus');
    if (!sidebarStatus) return;

    if (connected) {
        sidebarStatus.className = 'api-status connected';
        sidebarStatus.innerHTML = `
            <span class="material-icons-outlined">cloud_done</span>
            <span class="nav-label">${t('api.connected')}</span>
        `;
        sidebarStatus.title = channelName ? `${t('settings.api.status.connected', { channel: channelName })}` : '';
    } else {
        sidebarStatus.className = 'api-status';
        sidebarStatus.innerHTML = `
            <span class="material-icons-outlined">cloud_off</span>
            <span class="nav-label" data-i18n="api.disconnected">${t('api.disconnected')}</span>
        `;
        sidebarStatus.title = t('api.disconnected');
    }
}

/**
 * Affiche l'état verrouillé quand aucune API n'est connectée
 */
function renderLockedState() {
    // 1. Cartes statistiques avec tirets et cadenas
    setStatValue('totalViews', '—');
    setStatValue('totalSubscribers', '—');
    setStatValue('totalWatchTime', '—');
    setStatValue('totalRevenue', '—');

    ['viewsChange', 'subscribersChange', 'watchTimeChange', 'revenueChange'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.className = 'stat-change locked';
            el.innerHTML = `<span class="material-icons-outlined">lock</span>`;
        }
    });

    // 2. Graphique vierge / verrouillé
    if (typeof renderLockedChart === 'function') {
        renderLockedChart();
    }

    // 3. Dernières vidéos verrouillées
    const videosGrid = document.getElementById('videosGrid');
    if (videosGrid) {
        videosGrid.innerHTML = `
            <div class="locked-section-card">
                <span class="material-icons-outlined">lock</span>
                <h3 data-i18n="locked.title">${t('locked.title')}</h3>
                <p data-i18n="locked.desc">${t('locked.desc')}</p>
                <button class="btn-primary" onclick="navigateTo('settings')">
                    <span class="material-icons-outlined">vpn_key</span>
                    <span data-i18n="locked.button">${t('locked.button')}</span>
                </button>
            </div>
        `;
    }

    // 4. Page Contenu verrouillée
    const contentList = document.getElementById('contentList');
    if (contentList) {
        contentList.innerHTML = `
            <div class="locked-section-card">
                <span class="material-icons-outlined">lock</span>
                <h3 data-i18n="locked.title">${t('locked.title')}</h3>
                <p data-i18n="locked.desc">${t('locked.desc')}</p>
                <button class="btn-primary" onclick="navigateTo('settings')">
                    <span class="material-icons-outlined">vpn_key</span>
                    <span data-i18n="locked.button">${t('locked.button')}</span>
                </button>
            </div>
        `;
    }

    // 5. Page Analytics verrouillée
    const analyticsContent = document.getElementById('analyticsContent');
    if (analyticsContent) {
        analyticsContent.innerHTML = `
            <div class="locked-section-card">
                <span class="material-icons-outlined">lock</span>
                <h3 data-i18n="locked.title">${t('locked.title')}</h3>
                <p data-i18n="locked.desc">${t('locked.desc')}</p>
                <button class="btn-primary" onclick="navigateTo('settings')">
                    <span class="material-icons-outlined">vpn_key</span>
                    <span data-i18n="locked.button">${t('locked.button')}</span>
                </button>
            </div>
        `;
    }

    // 6. Page Commentaires
    initCommentsPage();
}

/**
 * Charge les vraies données issues de l'API YouTube
 */
function loadRealData() {
    const channel = YouTubeAPI.channelData;
    if (!channel) return;

    // Vues réelles
    setStatValue('totalViews', formatNumber(channel.views));
    setStatChange('viewsChange', null, true);

    // Abonnés réels
    setStatValue('totalSubscribers', formatNumber(channel.subscribers));
    setStatChange('subscribersChange', null, true);

    // Vidéos totales (au lieu du watch time fictif non disponible sans OAuth)
    const watchTimeLabel = document.querySelector('.stat-card:nth-child(3) .stat-label');
    if (watchTimeLabel) watchTimeLabel.textContent = t('content.all');
    setStatValue('totalWatchTime', formatNumber(channel.videosCount) + ' vidéos');
    setStatChange('watchTimeChange', null, true);

    // Revenus (nécessite YouTube Analytics API / OAuth, donc indication claire)
    const revenueLabel = document.querySelector('.stat-card:nth-child(4) .stat-label');
    if (revenueLabel) revenueLabel.textContent = t('stat.revenue');
    setStatValue('totalRevenue', 'N/A');
    const revChangeEl = document.getElementById('revenueChange');
    if (revChangeEl) {
        revChangeEl.className = 'stat-change neutral';
        revChangeEl.innerHTML = `<span class="material-icons-outlined">info</span> API Publique`;
    }

    // Graphique avec les données de la chaîne
    initRealChart();

    // Vidéos récentes réelles
    renderRealVideos();

    // Pages Contenu et Analytics réelles
    renderRealContentPage();
    renderRealAnalyticsPage();
    initCommentsPage();
}

function setStatValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setStatChange(id, change, isReal = false) {
    const el = document.getElementById(id);
    if (!el) return;

    if (isReal && (change === null || change === undefined)) {
        el.className = 'stat-change positive';
        el.innerHTML = `<span class="material-icons-outlined">check_circle</span> En direct`;
        return;
    }

    if (change === null || change === undefined) {
        el.className = 'stat-change';
        el.innerHTML = '';
        return;
    }

    const isPositive = change >= 0;
    el.className = `stat-change ${isPositive ? 'positive' : 'negative'}`;
    el.innerHTML = `
        <span class="material-icons-outlined">${isPositive ? 'trending_up' : 'trending_down'}</span>
        ${isPositive ? '+' : ''}${change.toFixed(1)}%
    `;
}

function renderRealVideos() {
    const grid = document.getElementById('videosGrid');
    if (!grid) return;

    const videos = YouTubeAPI.videosData;
    if (!videos || videos.length === 0) {
        grid.innerHTML = `<div class="no-videos-banner">Aucune vidéo récente trouvée pour cette chaîne.</div>`;
        return;
    }

    grid.innerHTML = videos.map(video => `
        <div class="video-card" onclick="window.open('https://www.youtube.com/watch?v=${video.id}', '_blank')">
            <div class="video-thumbnail">
                ${video.thumbnail ? `<img src="${video.thumbnail}" alt="${video.title}" class="video-thumb-img">` : `<span class="material-icons-outlined">play_circle</span>`}
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <div class="video-title" title="${video.title}">${video.title}</div>
                <div class="video-meta">
                    <span class="video-meta-item">
                        <span class="material-icons-outlined">visibility</span>
                        ${formatCompact(video.views)}
                    </span>
                    <span class="video-meta-item">
                        <span class="material-icons-outlined">thumb_up</span>
                        ${formatCompact(video.likes)}
                    </span>
                    <span class="video-meta-item">
                        <span class="material-icons-outlined">chat_bubble</span>
                        ${formatCompact(video.comments)}
                    </span>
                </div>
                <span class="video-status ${video.status}">
                    ${getStatusIcon(video.status)}
                    ${t('status.' + video.status)}
                </span>
            </div>
        </div>
    `).join('');
}

function renderRealContentPage() {
    const list = document.getElementById('contentList');
    if (!list) return;

    const sortSelect = document.getElementById('contentSort');
    let sortBy = sortSelect ? sortSelect.value : 'date';

    function renderSortedList() {
        const videos = [...YouTubeAPI.videosData];
        if (videos.length === 0) {
            list.innerHTML = `<div class="no-videos-banner">Aucune vidéo trouvée pour cette chaîne.</div>`;
            return;
        }

        const sorted = videos.sort((a, b) => {
            if (sortBy === 'views') return b.views - a.views;
            if (sortBy === 'likes') return b.likes - a.likes;
            return new Date(b.date) - new Date(a.date);
        });

        list.innerHTML = sorted.map(video => `
            <div class="content-row" onclick="window.open('https://www.youtube.com/watch?v=${video.id}', '_blank')">
                <div class="content-thumb">
                    ${video.thumbnail ? `<img src="${video.thumbnail}" alt="${video.title}" class="content-thumb-img">` : `<span class="material-icons-outlined">play_circle</span>`}
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="content-details">
                    <div class="content-title" title="${video.title}">${video.title}</div>
                    <div class="content-date">${formatDate(video.date)}</div>
                </div>
                <div class="content-stats">
                    <div class="content-stat">
                        <span class="content-stat-value">${formatCompact(video.views)}</span>
                        <span class="content-stat-label">${t('stat.views')}</span>
                    </div>
                    <div class="content-stat">
                        <span class="content-stat-value">${formatCompact(video.likes)}</span>
                        <span class="content-stat-label">Likes</span>
                    </div>
                    <div class="content-stat">
                        <span class="content-stat-value">${formatCompact(video.comments)}</span>
                        <span class="content-stat-label">Commentaires</span>
                    </div>
                </div>
                <span class="video-status ${video.status} content-status-badge">
                    ${getStatusIcon(video.status)}
                    ${t('status.' + video.status)}
                </span>
            </div>
        `).join('');
    }

    renderSortedList();

    if (sortSelect) {
        sortSelect.onchange = () => {
            sortBy = sortSelect.value;
            renderSortedList();
        };
    }
}

function renderRealAnalyticsPage() {
    const container = document.getElementById('analyticsContent');
    if (!container) return;

    const channel = YouTubeAPI.channelData;
    const videos = YouTubeAPI.videosData;

    if (!channel || videos.length === 0) {
        container.innerHTML = `<div class="no-videos-banner">Données statistiques en attente de synchronisation.</div>`;
        return;
    }

    const totalViewsRecent = videos.reduce((s, v) => s + v.views, 0);
    const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
    const totalComments = videos.reduce((s, v) => s + v.comments, 0);
    const avgViews = Math.round(totalViewsRecent / videos.length);
    const avgLikes = Math.round(totalLikes / videos.length);
    const engagement = totalViewsRecent > 0 ? ((totalLikes + totalComments) / totalViewsRecent * 100).toFixed(2) : '0';

    const topByViews = [...videos].sort((a, b) => b.views - a.views).slice(0, 5);

    container.innerHTML = `
        <div class="analytics-grid">
            <div class="analytics-card">
                <div class="analytics-card-icon" style="background: var(--color-views);">
                    <span class="material-icons-outlined">visibility</span>
                </div>
                <div class="analytics-card-label" data-i18n="analytics.avgViews">${t('analytics.avgViews')} (récentes)</div>
                <div class="analytics-card-value">${formatNumber(avgViews)}</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-icon" style="background: var(--color-subscribers);">
                    <span class="material-icons-outlined">thumb_up</span>
                </div>
                <div class="analytics-card-label" data-i18n="analytics.avgLikes">${t('analytics.avgLikes')}</div>
                <div class="analytics-card-value">${formatNumber(avgLikes)}</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-icon" style="background: var(--color-watchtime);">
                    <span class="material-icons-outlined">chat_bubble</span>
                </div>
                <div class="analytics-card-label" data-i18n="analytics.totalComments">${t('analytics.totalComments')}</div>
                <div class="analytics-card-value">${formatNumber(totalComments)}</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-icon" style="background: var(--color-revenue);">
                    <span class="material-icons-outlined">trending_up</span>
                </div>
                <div class="analytics-card-label" data-i18n="analytics.engagement">${t('analytics.engagement')}</div>
                <div class="analytics-card-value">${engagement}%</div>
            </div>
        </div>

        <h3 class="analytics-section-title" data-i18n="analytics.top">${t('analytics.top')}</h3>

        ${topByViews.map((v, i) => `
            <div class="top-video-row" onclick="window.open('https://www.youtube.com/watch?v=${v.id}', '_blank')">
                <div class="top-video-rank">${i + 1}</div>
                <div class="top-video-info">
                    <div class="top-video-title">${v.title}</div>
                    <div class="top-video-subtitle">${formatDate(v.date)} • 👍 ${formatCompact(v.likes)} likes • 💬 ${formatCompact(v.comments)} comm.</div>
                </div>
                <div class="top-video-value">${formatCompact(v.views)} ${t('stat.views').toLowerCase()}</div>
            </div>
        `).join('')}
    `;
}


/* ===========================================
   NAVIGATION ENTRE PAGES
   =========================================== */
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });
}

function navigateTo(pageId) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');

    // Fermer sidebar mobile si ouverte
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('active');

    // Si on navigue vers le calendrier, re-render pour actualiser l'affichage
    if (pageId === 'calendar' && typeof Calendar !== 'undefined') {
        Calendar.render();
    }

    window.scrollTo(0, 0);
}


/* ===========================================
   PAGE PARAMÈTRES & FORMULAIRE API
   =========================================== */
function initSettingsPage() {
    // --- Boutons Thème ---
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            Settings.applyTheme(btn.dataset.theme);
            showToast();
        });
    });

    // --- Boutons Langue ---
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            Settings.applyLanguage(btn.dataset.lang);
            showToast();
        });
    });

    // --- Champs API YouTube ---
    const apiKeyInput = document.getElementById('apiKeyInput');
    const channelIdInput = document.getElementById('channelIdInput');
    const saveBtn = document.getElementById('saveApiBtn');
    const disconnectBtn = document.getElementById('disconnectApiBtn');
    const statusEl = document.getElementById('apiFormStatus');

    if (apiKeyInput) apiKeyInput.value = Settings.get('apiKey') || '';
    if (channelIdInput) channelIdInput.value = Settings.get('channelId') || '';

    // Mettre à jour l'état visuel du statut API dans les paramètres
    renderApiSettingsStatus();

    // Clic sur "Tester et connecter"
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const key = apiKeyInput ? apiKeyInput.value.trim() : '';
            const channel = channelIdInput ? channelIdInput.value.trim() : '';

            if (!key || !channel) {
                setApiStatusMessage(t('api.error.missing_key') + ' / ' + t('api.error.missing_channel'), 'error');
                return;
            }

            // Désactiver le bouton et afficher l'état de chargement
            saveBtn.disabled = true;
            const originalBtnHtml = saveBtn.innerHTML;
            saveBtn.innerHTML = `<span class="btn-spinner"></span> <span>${t('api.status.checking')}</span>`;
            setApiStatusMessage(t('api.status.checking'), 'info');

            // Appel de vérification réelle
            const result = await YouTubeAPI.verifyAndFetch(key, channel);

            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnHtml;

            if (result.success) {
                setApiStatusMessage(t('api.success', { channel: result.channel.title }), 'success');
                updateConnectionUI();
                renderApiSettingsStatus();
                showToast(t('settings.saved'));
            } else {
                // Erreur réelle constatée (fausse clé, mauvaise chaîne, etc.)
                setApiStatusMessage(result.message, 'error');
                updateConnectionUI();
                renderApiSettingsStatus();
            }
        });
    }

    // Clic sur "Déconnecter"
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => {
            YouTubeAPI.disconnect();
            if (apiKeyInput) apiKeyInput.value = '';
            if (channelIdInput) channelIdInput.value = '';
            setApiStatusMessage(t('api.disconnected.msg'), 'info');
            updateConnectionUI();
            renderApiSettingsStatus();
            showToast(t('api.disconnected.msg'));
        });
    }

    // --- Bouton Réinitialiser l'application ---
    const resetBtn = document.getElementById('resetAppBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const confirmed = window.confirm(t('settings.reset.confirm'));
            if (confirmed) {
                // Vider le stockage local de l'application
                localStorage.clear();

                // Recharger la page pour repartir à zéro
                window.location.reload();
            }
        });
    }
}

function setApiStatusMessage(message, type = 'info') {
    const statusEl = document.getElementById('apiFormStatus');
    if (!statusEl) return;

    statusEl.className = `api-form-status ${type}`;
    statusEl.innerHTML = message;
}

function renderApiSettingsStatus() {
    const isConnected = YouTubeAPI.isConnected();
    const statusEl = document.getElementById('apiFormStatus');
    const disconnectBtn = document.getElementById('disconnectApiBtn');

    if (disconnectBtn) {
        disconnectBtn.style.display = isConnected ? 'inline-flex' : 'none';
    }

    if (statusEl && !statusEl.classList.contains('error')) {
        if (isConnected) {
            statusEl.className = 'api-form-status success';
            statusEl.textContent = t('settings.api.status.connected', { channel: YouTubeAPI.channelData.title });
        } else {
            statusEl.className = 'api-form-status';
            statusEl.textContent = t('settings.api.status.disconnected');
        }
    }
}


/* ===========================================
   MODAL D'AIDE / TUTO API (?)
   =========================================== */
function initApiHelpModal() {
    const openBtn = document.getElementById('openApiHelpBtn');
    const modal = document.getElementById('apiHelpModal');
    const closeBtn = document.getElementById('closeApiHelpBtn');
    const closeBottomBtn = document.getElementById('closeApiHelpBottomBtn');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });
    }

    const closeModal = () => {
        if (modal) modal.classList.remove('show');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}


/* ===========================================
   SÉLECTEUR DE PÉRIODE
   =========================================== */
function initPeriodSelector() {
    const selector = document.getElementById('periodSelect');
    if (selector) {
        selector.addEventListener('change', () => {
            if (YouTubeAPI.isConnected()) {
                initRealChart();
            }
        });
    }
}


/* ===========================================
   SIDEBAR MOBILE & TOAST
   =========================================== */
function initSidebar() {
    const toggle  = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggle && sidebar && overlay) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

function showToast(message) {
    const toast = document.getElementById('settingsToast');
    if (!toast) return;

    if (message) {
        const textSpan = toast.querySelector('span:not(.material-icons-outlined)');
        if (textSpan) textSpan.textContent = message;
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ===========================================
   PAGE COMMENTAIRES
   =========================================== */
function initCommentsPage() {
    const container = document.getElementById('commentsContent');
    if (!container) return;

    const isConnected = YouTubeAPI.isConnected();

    if (!isConnected) {
        container.innerHTML = `
            <div class="comments-info-banner">
                <span class="material-icons-outlined">forum</span>
                <p data-i18n="comments.placeholder">${t('comments.placeholder')}</p>
                <button class="btn-primary" onclick="navigateTo('settings')">
                    <span class="material-icons-outlined">vpn_key</span>
                    <span data-i18n="comments.connect">${t('comments.connect')}</span>
                </button>
            </div>
        `;
        return;
    }

    // Si connecté, afficher les commentaires des dernières vidéos réelles
    const videos = YouTubeAPI.videosData;
    container.innerHTML = `
        <div class="comments-list">
            <div class="comments-connected-notice">
                <span class="material-icons-outlined">info</span>
                <span>Voici les statistiques d'interaction sur vos vidéos récentes. Les commentaires textuels détaillés peuvent être consultés directement en cliquant sur vos vidéos ci-dessous.</span>
            </div>
            ${videos.map(v => `
                <div class="comment-card" onclick="window.open('https://www.youtube.com/watch?v=${v.id}', '_blank')">
                    <div class="comment-avatar" style="background: var(--color-views);">
                        <span class="material-icons-outlined">play_arrow</span>
                    </div>
                    <div class="comment-body">
                        <div class="comment-header">
                            <span class="comment-author">${v.title}</span>
                            <span class="comment-time">${formatDate(v.date)}</span>
                        </div>
                        <div class="comment-text">Cette vidéo a généré <strong>${formatNumber(v.comments)}</strong> commentaires et <strong>${formatNumber(v.likes)}</strong> mentions j'aime.</div>
                        <div class="comment-actions">
                            <button class="comment-action">
                                <span class="material-icons-outlined">chat</span> Voir sur YouTube
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}


/* ===========================================
   UTILITAIRES DE FORMATAGE
   =========================================== */
function getStatusIcon(status) {
    const icons = { public: 'public', private: 'lock', unlisted: 'link' };
    return `<span class="material-icons-outlined">${icons[status] || 'public'}</span>`;
}

function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    const lang = Settings.get('language') || 'fr';
    return num.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR');
}

function formatCompact(num) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const lang = Settings.get('language') || 'fr';
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}
