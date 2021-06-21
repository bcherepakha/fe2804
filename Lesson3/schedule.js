import {MY_SCHEDULE} from './myschedule.js';

export class Schedule {
    constructor(day) {
        const currentDate = new Date(day);

        this.state = {
            day,
            currentDate,
        };

        this.titleEl = document.querySelector('.day-view__title');
        this.bodyEl = document.querySelector('.day-view__body');
        this.hourHeight = 124;

        this.bodyEl.addEventListener('drop', this.dropHandler.bind(this), false);

        this.render();
    }

    getCurrentId() {
        return this.state.day;
    }

    getCurrentSchedule() {
        return MY_SCHEDULE[this.getCurrentId()];
    }

    renderTitle() {
        const { currentDate } = this.state;
        const monthNum = currentDate.getMonth();
        const dayNum = currentDate.getDate();
        const yearNum = currentDate.getFullYear();
        // eslint-disable-next-line no-undef
        const monthName = Calendar.MONTHES[monthNum];

        this.titleEl.innerText = `${dayNum} ${monthName} ${yearNum}`;
    }

    getEvents(startHour, endHour) {
        const currentSchedule = this.getCurrentSchedule();
        const { currentDate } = this.state;
        const eventsStartTime = new Date(currentDate);
        const eventsEndTime = new Date(currentDate);

        eventsStartTime.setHours(startHour);
        eventsStartTime.setMinutes(0);
        eventsStartTime.setSeconds(0);
        eventsStartTime.setMilliseconds(0);

        eventsEndTime.setHours(endHour);
        eventsEndTime.setMinutes(0);
        eventsEndTime.setSeconds(0);
        eventsEndTime.setMilliseconds(0);

        return currentSchedule && currentSchedule.filter(e => {
            const startDate = new Date(e.startDate);

            return  startDate >= eventsStartTime && startDate < eventsEndTime;
        });
    }

    createHour(hh) {
        const rootEl = document.createElement('div');
        const timeEl = document.createElement('div');

        rootEl.className = 'day-view__item';
        timeEl.className = 'day-view__time';
        timeEl.innerText = `${hh.toString().padStart(2, '0')}:00`;

        rootEl.append(timeEl);

        // rootEl. = true;

        return rootEl;
    }

    renderEvent(event) {
        const eventEl = document.createElement('div');
        const baseClass = 'day-view__event';
        const { currentDate } = this.state;
        const renderStartTime = new Date(currentDate);
        const startDate = new Date(event.startDate);

        renderStartTime.setHours(9);
        renderStartTime.setMinutes(0);
        renderStartTime.setSeconds(0);
        renderStartTime.setMilliseconds(0);

        const timeDiff = (startDate - renderStartTime) / 60000;

        eventEl.innerText = event.text;
        eventEl.className = baseClass;

        if (event.category) {
            eventEl.classList.add(`${baseClass}--${event.category}`);
        }

        eventEl.style.top = `${(100*timeDiff / 720).toFixed(4)}%`;
        eventEl.style.height = `${(100*event.duration/720).toFixed(4)}%`;

        eventEl.draggable = true;

        eventEl.addEventListener('dragstart', this.dragStartEvent.bind(this, event), false);
        eventEl.addEventListener('dragend', this.dragEndEvent.bind(this, event), false);

        return eventEl;
    }

    dragStartEvent(event) {
        console.log('dragStartEvent', event );
    }

    dragEndEvent(event, e) {
        console.log('dragEndEvent', event );
        e.preventDefault();
        e.stopPropagation();
    }

    dropHandler(e) {
        // prevent default action (open as link for some elements)
        e.preventDefault();
        e.stopPropagation();

        console.log('dropHandler');
    }

    renderEvents(events) {
        return events.map(e => this.renderEvent(e));
    }

    renderBody() {
        const elements = [];
        const events = this.getCurrentSchedule();

        if (events) {
            events.forEach(e => elements.push(this.renderEvent(e)));
        }

        for (let hh=9; hh <= 20; hh++) {
            elements.push(
                this.createHour(hh)
            );
        }

        this.bodyEl.innerText = '';
        this.bodyEl.append(...elements);
    }

    render() {
        this.renderTitle();
        this.renderBody();
    }
}
