/* ============================================
   youtube-api.js — Gestion de la vraie API YouTube
   
   Vérification réelle de la clé API, récupération
   des données réelles de la chaîne et vidéos.
   ============================================ */

const YouTubeAPI = {
    // État de connexion
    connected: false,
    channelData: null,
    videosData: [],

    /**
     * Vérifie si l'API est réellement connectée
     */
    isConnected() {
        return this.connected && this.channelData !== null;
    },

    /**
     * Initialisation au démarrage :
     * si une clé et un ID sont stockés, on tente de restaurer la connexion
     */
    async init() {
        const apiKey = Settings.get('apiKey');
        const channelId = Settings.get('channelId');

        if (apiKey && channelId) {
            // Tenter de charger les données
            const result = await this.verifyAndFetch(apiKey, channelId, true);
            if (!result.success) {
                // Si la clé sauvegardée est invalide
                this.connected = false;
                this.channelData = null;
                Settings.set('apiVerified', 'false');
            }
        } else {
            this.connected = false;
            this.channelData = null;
        }
    },

    /**
     * Teste et vérifie la clé API et l'ID de chaîne auprès de Google
     * @param {string} apiKey 
     * @param {string} channelInput (ID UC... ou @handle)
     * @param {boolean} isSilent (si vrai, ne déclenche pas d'alertes UI directes)
     */
    async verifyAndFetch(apiKey, channelInput, isSilent = false) {
        apiKey = (apiKey || '').trim();
        channelInput = (channelInput || '').trim();

        if (!apiKey) {
            return { success: false, error: 'missing_key', message: t('api.error.missing_key') };
        }
        if (!channelInput) {
            return { success: false, error: 'missing_channel', message: t('api.error.missing_channel') };
        }

        try {
            // Déterminer le mode de recherche (par ID ou par Handle @)
            let channel = null;

            // 1. Essai avec forHandle si commence par @ ou s'il ne ressemble pas à un ID UC... (24 caractères)
            const isLikelyHandle = channelInput.startsWith('@') || (channelInput.length !== 24 && !channelInput.startsWith('UC'));
            const cleanHandle = channelInput.startsWith('@') ? channelInput.substring(1) : channelInput;

            if (isLikelyHandle) {
                // Tenter via forHandle
                const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(cleanHandle)}&key=${apiKey}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.error) {
                    return this._handleApiError(data.error);
                }

                if (data.items && data.items.length > 0) {
                    channel = data.items[0];
                }
            }

            // 2. Si non trouvé ou si c'est un ID standard UC...
            if (!channel) {
                const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${encodeURIComponent(channelInput)}&key=${apiKey}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.error) {
                    return this._handleApiError(data.error);
                }

                if (data.items && data.items.length > 0) {
                    channel = data.items[0];
                }
            }

            // 3. Si toujours non trouvé mais que l'input n'avait pas de @, essayer quand même forHandle en secours
            if (!channel && !channelInput.startsWith('@')) {
                const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(channelInput)}&key=${apiKey}`;
                const res = await fetch(url);
                const data = await res.json();

                if (!data.error && data.items && data.items.length > 0) {
                    channel = data.items[0];
                }
            }

            // Si aucune chaîne n'est renvoyée
            if (!channel) {
                return {
                    success: false,
                    error: 'not_found',
                    message: t('api.error.not_found')
                };
            }

            // Succès ! On enregistre les données de la chaîne
            this.channelData = {
                id: channel.id,
                title: channel.snippet.title,
                handle: channel.snippet.customUrl || ('@' + channel.snippet.title.replace(/\s+/g, '').toLowerCase()),
                description: channel.snippet.description,
                avatar: channel.snippet.thumbnails?.medium?.url || channel.snippet.thumbnails?.default?.url || '',
                views: parseInt(channel.statistics.viewCount || 0, 10),
                subscribers: parseInt(channel.statistics.subscriberCount || 0, 10),
                videosCount: parseInt(channel.statistics.videoCount || 0, 10),
                uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || null,
            };

            // Charger les dernières vidéos réelles
            if (this.channelData.uploadsPlaylistId) {
                await this.fetchRecentVideos(apiKey, this.channelData.uploadsPlaylistId);
            }

            this.connected = true;
            Settings.set('apiKey', apiKey);
            Settings.set('channelId', channelInput);
            Settings.set('apiVerified', 'true');

            return {
                success: true,
                channel: this.channelData
            };

        } catch (err) {
            console.error('Erreur API YouTube:', err);
            return {
                success: false,
                error: 'network',
                message: t('api.error.network')
            };
        }
    },

    /**
     * Récupère les dernières vidéos réelles via la playlist uploads
     */
    async fetchRecentVideos(apiKey, uploadsPlaylistId) {
        try {
            const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=8&key=${apiKey}`;
            const res = await fetch(playlistUrl);
            const data = await res.json();

            if (!data.items || data.items.length === 0) {
                this.videosData = [];
                return;
            }

            const videoIds = data.items.map(item => item.contentDetails.videoId).filter(Boolean);

            if (videoIds.length === 0) {
                this.videosData = [];
                return;
            }

            // Récupérer les stats et durée des vidéos
            const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds.join(',')}&key=${apiKey}`;
            const videosRes = await fetch(videosUrl);
            const videosJson = await videosRes.json();

            if (videosJson.items) {
                this.videosData = videosJson.items.map(v => ({
                    id: v.id,
                    title: v.snippet.title,
                    views: parseInt(v.statistics.viewCount || 0, 10),
                    likes: parseInt(v.statistics.likeCount || 0, 10),
                    comments: parseInt(v.statistics.commentCount || 0, 10),
                    date: v.snippet.publishedAt.split('T')[0],
                    duration: this._parseDuration(v.contentDetails.duration),
                    status: v.status?.privacyStatus || 'public',
                    thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || null
                }));
            }
        } catch (e) {
            console.warn('Impossible de charger les vidéos récentes:', e);
            this.videosData = [];
        }
    },

    /**
     * Déconnexion propre
     */
    disconnect() {
        this.connected = false;
        this.channelData = null;
        this.videosData = [];
        Settings.set('apiKey', '');
        Settings.set('channelId', '');
        Settings.set('apiVerified', 'false');
    },

    /**
     * Traite les erreurs retournées par l'API Google
     */
    _handleApiError(errorObj) {
        const message = errorObj.message || '';
        const reason = errorObj.errors?.[0]?.reason || '';

        if (reason === 'keyInvalid' || message.toLowerCase().includes('api key not valid')) {
            return { success: false, error: 'invalid_key', message: t('api.error.invalid_key') };
        }
        if (reason === 'accessNotConfigured' || message.toLowerCase().includes('not been used in project')) {
            return { success: false, error: 'api_not_enabled', message: t('api.error.not_enabled') };
        }
        if (reason === 'quotaExceeded') {
            return { success: false, error: 'quota_exceeded', message: t('api.error.quota') };
        }

        return {
            success: false,
            error: 'api_error',
            message: message || t('api.error.generic')
        };
    },

    /**
     * Convertit la durée ISO 8601 (ex: PT4M13S) en format lisible (ex: "4:13")
     */
    _parseDuration(isoDuration) {
        if (!isoDuration) return '0:00';
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '0:00';

        const hours = parseInt(match[1] || 0, 10);
        const minutes = parseInt(match[2] || 0, 10);
        const seconds = parseInt(match[3] || 0, 10);

        const pad = (n) => String(n).padStart(2, '0');

        if (hours > 0) {
            return `${hours}:${pad(minutes)}:${pad(seconds)}`;
        }
        return `${minutes}:${pad(seconds)}`;
    }
};
