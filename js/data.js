/* ============================================
   data.js — Données de démonstration
   
   Ce fichier contient des données fictives pour
   tester l'interface. Plus tard, elles seront
   remplacées par les données de l'API YouTube.
   ============================================ */

const DEMO_DATA = {

    // ---- Statistiques globales ----
    stats: {
        views:        { value: 128450,  change: +12.4, label: "vues" },
        subscribers:  { value: 8320,    change: +5.7,  label: "abonnés" },
        watchTime:    { value: 4280,    change: +8.2,  label: "heures" },
        revenue:      { value: 1245.60, change: -2.1,  label: "€" },
    },

    // ---- Données du graphique (28 derniers jours) ----
    chart: {
        labels: [
            "13 Oct", "14 Oct", "15 Oct", "16 Oct", "17 Oct", "18 Oct", "19 Oct",
            "20 Oct", "21 Oct", "22 Oct", "23 Oct", "24 Oct", "25 Oct", "26 Oct",
            "27 Oct", "28 Oct", "29 Oct", "30 Oct", "31 Oct", "1 Nov", "2 Nov",
            "3 Nov", "4 Nov", "5 Nov", "6 Nov", "7 Nov", "8 Nov", "9 Nov"
        ],
        views: [
            3200, 4100, 3800, 5200, 6800, 7200, 5400,
            4800, 5100, 4600, 5800, 6200, 7400, 8100,
            6900, 5500, 4900, 5200, 5800, 6100, 6700,
            7300, 6500, 5400, 4800, 5600, 6200, 7000
        ],
        subscribers: [
            180, 210, 195, 260, 320, 350, 270,
            240, 255, 230, 290, 310, 370, 400,
            340, 275, 245, 260, 290, 305, 335,
            365, 325, 270, 240, 280, 310, 350
        ],
        watchtime: [
            95, 120, 112, 155, 200, 215, 160,
            140, 150, 135, 170, 185, 220, 240,
            205, 165, 145, 155, 170, 180, 200,
            215, 195, 160, 140, 165, 185, 210
        ]
    },

    // ---- Dernières vidéos ----
    videos: [
        {
            id: "v1",
            title: "Comment créer un Dashboard YouTube avec Python — Tutoriel Complet",
            views: 15200,
            likes: 840,
            comments: 92,
            date: "2026-11-07",
            duration: "24:18",
            status: "public",
            thumbnail: null
        },
        {
            id: "v2",
            title: "10 extensions VS Code indispensables en 2026",
            views: 28400,
            likes: 1520,
            comments: 187,
            date: "2026-11-03",
            duration: "18:42",
            status: "public",
            thumbnail: null
        },
        {
            id: "v3",
            title: "Intelligence Artificielle : Les 5 outils qui changent tout",
            views: 42100,
            likes: 2300,
            comments: 315,
            date: "2026-10-28",
            duration: "31:05",
            status: "public",
            thumbnail: null
        },
        {
            id: "v4",
            title: "Automatiser sa vie avec Zapier et Make — Guide débutant",
            views: 9800,
            likes: 620,
            comments: 54,
            date: "2026-10-22",
            duration: "15:33",
            status: "public",
            thumbnail: null
        },
        {
            id: "v5",
            title: "Mon setup 2026 : bureau, écrans, micro et caméra",
            views: 35600,
            likes: 1890,
            comments: 234,
            date: "2026-10-15",
            duration: "20:11",
            status: "public",
            thumbnail: null
        },
        {
            id: "v6",
            title: "[BROUILLON] Prochaine vidéo — À venir bientôt",
            views: 0,
            likes: 0,
            comments: 0,
            date: "2026-11-09",
            duration: "12:45",
            status: "private",
            thumbnail: null
        }
    ]
};
