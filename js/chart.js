/* ============================================
   chart.js — Configuration du graphique
   Mode sombre, mode connecté et mode verrouillé
   ============================================ */

let performanceChart = null;

function getChartColors(metric) {
    const isDark = Settings.get('theme') === 'dark';

    const palette = {
        views:       { line: isDark ? '#8AB4F8' : '#1A73E8', fill: isDark ? 'rgba(138,180,248,0.12)' : 'rgba(26,115,232,0.08)' },
        subscribers: { line: isDark ? '#FCAD70' : '#E8710A', fill: isDark ? 'rgba(252,173,112,0.12)' : 'rgba(232,113,10,0.08)' },
        watchtime:   { line: isDark ? '#81C995' : '#0D904F', fill: isDark ? 'rgba(129,201,149,0.12)' : 'rgba(13,144,79,0.08)' },
    };

    return palette[metric] || palette.views;
}

/**
 * Affiche un graphique verrouillé lorsqu'aucune chaîne n'est connectée
 */
function renderLockedChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    if (performanceChart) {
        performanceChart.destroy();
        performanceChart = null;
    }

    const isDark = Settings.get('theme') === 'dark';

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['—', '—', '—', '—', '—', '—', '—'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: isDark ? '#333333' : '#E0E0E0',
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: isDark ? '#555555' : '#CCCCCC' },
                    border: { display: false }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: isDark ? '#222222' : '#F0F0F0', drawBorder: false },
                    ticks: { color: isDark ? '#555555' : '#CCCCCC', callback: () => '—' },
                    border: { display: false }
                }
            }
        }
    });
}

/**
 * Affiche le graphique basé sur les vidéos réelles de la chaîne
 */
function initRealChart(metric = 'views') {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    const isDark = Settings.get('theme') === 'dark';
    const videos = YouTubeAPI.videosData || [];

    if (videos.length === 0) {
        renderLockedChart();
        return;
    }

    // Classer par date chronologique pour le graphique
    const sortedVideos = [...videos].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedVideos.map(v => {
        const parts = v.date.split('-');
        return `${parts[2]}/${parts[1]}`;
    });

    let data = [];
    if (metric === 'views') {
        data = sortedVideos.map(v => v.views);
    } else if (metric === 'subscribers') {
        data = sortedVideos.map(v => v.likes); // Likes en corrélation avec l'engagement
    } else {
        data = sortedVideos.map(v => v.comments);
    }

    const colors = getChartColors(metric);

    if (performanceChart) {
        performanceChart.destroy();
    }

    const metricTitle = metric === 'views' ? t('chart.views') :
                        metric === 'subscribers' ? 'Mentions J\'aime' : 'Commentaires';

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: metricTitle,
                data: data,
                borderColor: colors.line,
                backgroundColor: colors.fill,
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: colors.line,
                pointHoverBackgroundColor: colors.line,
                pointHoverBorderColor: isDark ? '#1A1A1A' : '#FFFFFF',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#E8EAED' : '#0F0F0F',
                    titleColor: isDark ? '#202124' : '#FFFFFF',
                    bodyColor: isDark ? '#202124' : '#FFFFFF',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR')}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Roboto', size: 11 },
                        color: isDark ? '#717171' : '#909090',
                    },
                    border: { display: false },
                },
                y: {
                    grid: {
                        color: isDark ? '#272727' : '#F2F2F2',
                        drawBorder: false,
                    },
                    ticks: {
                        font: { family: 'Roboto', size: 11 },
                        color: isDark ? '#717171' : '#909090',
                        callback: function(value) {
                            if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
                            return value;
                        }
                    },
                    border: { display: false },
                    beginAtZero: true,
                }
            }
        }
    });

    // Mettre à jour les onglets de métrique
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            initRealChart(tab.dataset.metric);
        };
    });
}

function updateChartTheme() {
    if (YouTubeAPI.isConnected()) {
        const activeTab = document.querySelector('.chart-tab.active');
        const metric = activeTab ? activeTab.dataset.metric : 'views';
        initRealChart(metric);
    } else {
        renderLockedChart();
    }
}
