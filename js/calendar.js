/* ============================================
   calendar.js — Calendrier interactif
   
   Permet de créer des programmations et rappels.
   Tout est sauvegardé en localStorage.
   ============================================ */

const Calendar = {
    currentMonth: new Date().getMonth(),
    currentYear:  new Date().getFullYear(),
    events: [],

    /* ---------- Init ---------- */
    init() {
        this.loadEvents();
        this.render();
        this.initEventListeners();
    },

    /* ---------- localStorage ---------- */
    loadEvents() {
        try {
            const stored = localStorage.getItem('ytdash_calendar_events');
            this.events = stored ? JSON.parse(stored) : [];
        } catch (e) {
            this.events = [];
        }
    },

    saveEvents() {
        try {
            localStorage.setItem('ytdash_calendar_events', JSON.stringify(this.events));
        } catch (e) {
            console.warn('Impossible de sauvegarder les événements.');
        }
    },

    /* ---------- CRUD ---------- */
    addEvent(event) {
        event.id = Date.now();
        this.events.push(event);
        this.saveEvents();
        this.render();
    },

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveEvents();
        this.render();
    },

    getEventsForDate(dateStr) {
        return this.events.filter(e => e.date === dateStr);
    },

    getUpcomingEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];
        return this.events
            .filter(e => e.date >= todayStr)
            .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
            .slice(0, 15);
    },

    /* ---------- Render ---------- */
    render() {
        this.renderGrid();
        this.renderUpcoming();
    },

    renderGrid() {
        const container = document.getElementById('calendarGrid');
        if (!container) return;

        const year  = this.currentYear;
        const month = this.currentMonth;
        const firstDay   = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Lundi = 0 (convention FR)
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const todayStr = new Date().toISOString().split('T')[0];

        // Titre mois/année
        const lang = Settings.get('language');
        const locale = lang === 'en' ? 'en-US' : 'fr-FR';
        const monthLabel = firstDay.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
        const titleEl = document.getElementById('calendarMonthYear');
        if (titleEl) titleEl.textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

        // Jours de la semaine
        const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        let html = '<div class="cal-header-row">';
        dayKeys.forEach(k => {
            html += `<div class="cal-day-name">${t('calendar.days.' + k)}</div>`;
        });
        html += '</div><div class="cal-body">';

        // Cases vides avant le 1er
        for (let i = 0; i < startDay; i++) {
            html += '<div class="cal-cell empty"></div>';
        }

        // Cases des jours
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events  = this.getEventsForDate(dateStr);
            const isToday = dateStr === todayStr;

            html += `<div class="cal-cell${isToday ? ' today' : ''}${events.length ? ' has-events' : ''}" data-date="${dateStr}">`;
            html += `<span class="cal-day-number${isToday ? ' today' : ''}">${day}</span>`;

            if (events.length > 0) {
                html += '<div class="cal-events">';
                events.slice(0, 2).forEach(ev => {
                    const icon = ev.type === 'publication' ? '📹' : ev.type === 'reminder' ? '🔔' : '📝';
                    html += `<div class="cal-event cal-event-${ev.type}" title="${ev.title}">${icon} ${ev.title}</div>`;
                });
                if (events.length > 2) {
                    html += `<div class="cal-event-more">+${events.length - 2}</div>`;
                }
                html += '</div>';
            }

            html += '</div>';
        }

        // Cases vides en fin
        const totalCells = startDay + daysInMonth;
        const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 0; i < remaining; i++) {
            html += '<div class="cal-cell empty"></div>';
        }

        html += '</div>';
        container.innerHTML = html;

        // Clic sur une case = ouvrir le modal
        container.querySelectorAll('.cal-cell:not(.empty)').forEach(cell => {
            cell.addEventListener('click', () => this.openModal(cell.dataset.date));
        });
    },

    renderUpcoming() {
        const container = document.getElementById('upcomingEvents');
        if (!container) return;

        const upcoming = this.getUpcomingEvents();

        if (upcoming.length === 0) {
            container.innerHTML = `
                <div class="no-events">
                    <span class="material-icons-outlined">event_available</span>
                    <p data-i18n="calendar.noEvents">${t('calendar.noEvents')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = upcoming.map(ev => {
            const icon = ev.type === 'publication' ? '📹' : ev.type === 'reminder' ? '🔔' : '📝';
            const typeLabel = t('calendar.type.' + ev.type);
            return `
                <div class="upcoming-event cal-event-${ev.type}-row">
                    <div class="upcoming-event-icon">${icon}</div>
                    <div class="upcoming-event-info">
                        <div class="upcoming-event-title">${ev.title}</div>
                        <div class="upcoming-event-meta">
                            <span>${formatDate(ev.date)}</span>
                            ${ev.time ? `<span>• ${ev.time}</span>` : ''}
                            <span>• ${typeLabel}</span>
                        </div>
                        ${ev.notes ? `<div class="upcoming-event-notes">${ev.notes}</div>` : ''}
                    </div>
                    <button class="upcoming-event-delete" onclick="event.stopPropagation(); Calendar.deleteEvent(${ev.id})" title="${t('calendar.delete')}">
                        <span class="material-icons-outlined">close</span>
                    </button>
                </div>
            `;
        }).join('');
    },

    /* ---------- Modal ---------- */
    openModal(date) {
        const modal = document.getElementById('calendarModal');
        if (!modal) return;

        document.getElementById('eventDate').value  = date || new Date().toISOString().split('T')[0];
        document.getElementById('eventTitle').value  = '';
        document.getElementById('eventTime').value   = '';
        document.getElementById('eventType').value   = 'reminder';
        document.getElementById('eventNotes').value  = '';

        modal.classList.add('show');
        setTimeout(() => document.getElementById('eventTitle').focus(), 100);
    },

    closeModal() {
        const modal = document.getElementById('calendarModal');
        if (modal) modal.classList.remove('show');
    },

    submitEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const date  = document.getElementById('eventDate').value;
        const time  = document.getElementById('eventTime').value;
        const type  = document.getElementById('eventType').value;
        const notes = document.getElementById('eventNotes').value.trim();

        if (!title || !date) return;

        this.addEvent({ title, date, time, type, notes });
        this.closeModal();
        showToast();
    },

    /* ---------- Navigation mois ---------- */
    prevMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
        this.render();
    },

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
        this.render();
    },

    goToday() {
        this.currentMonth = new Date().getMonth();
        this.currentYear  = new Date().getFullYear();
        this.render();
    },

    /* ---------- Event Listeners ---------- */
    initEventListeners() {
        document.getElementById('calPrev')?.addEventListener('click', () => this.prevMonth());
        document.getElementById('calNext')?.addEventListener('click', () => this.nextMonth());
        document.getElementById('calToday')?.addEventListener('click', () => this.goToday());
        document.getElementById('addEventBtn')?.addEventListener('click', () => this.openModal());
        document.getElementById('modalClose')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modalCancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modalSubmit')?.addEventListener('click', () => this.submitEvent());

        document.getElementById('calendarModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'calendarModal') this.closeModal();
        });

        document.getElementById('eventTitle')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.submitEvent();
        });
    }
};
