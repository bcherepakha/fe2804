import {MY_SCHEDULE} from './myschedule.js';

function delay(fn, CALL_FREQUENCY = 300) {
    //* LE = { lastCallTime, function }
    let lastCallTime = 0;

    return function (...args) {
        const currentTime = Date.now();

        if (currentTime - lastCallTime > CALL_FREQUENCY) {
            //* execute
            lastCallTime = currentTime;

            return fn.apply(this, args);
        }
    };
}

export class Schedule {
    constructor(day) {
        const currentDate = new Date(day);

        currentDate.setHours(9);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        this.state = {
            day,
            currentDate,
            draggedEvent: null
        };

        this.titleEl = document.querySelector('.day-view__title');
        this.bodyEl = document.querySelector('.day-view__body');
        this.hourHeight = 124;

        //* NOTE: prevent dragover default to allow drop
        this.bodyEl.addEventListener('dragover', this.preventDefault, false);
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
        const startDate = new Date(this.state.currentDate);

        startDate.setHours(hh);

        rootEl.className = 'day-view__item';
        timeEl.className = 'day-view__time';
        timeEl.innerText = `${hh.toString().padStart(2, '0')}:00`;

        rootEl.append(timeEl);

        // rootEl.addEventListener('dragenter', this.dragEnterHour.bind(this), false);
        // rootEl.addEventListener('dragleave', this.dragLeaveHour.bind(this), false);
        rootEl.addEventListener('dragover', this.dragOver.bind(this, 'hour', rootEl, startDate, 60));

        return rootEl;
    }

    dragEnterHour(e) {
        e.currentTarget.classList.add('day-view__item--drag-over');
    }

    dragLeaveHour(e) {
        e.currentTarget.classList.remove('day-view__item--drag-over');
    }

    preventDefault(event) {
        event.preventDefault();
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

        eventEl.addEventListener('dragstart', this.dragStartEvent.bind(this, event, eventEl), false);
        eventEl.addEventListener('dragend', this.dragEndEvent.bind(this, event, eventEl), false);
        eventEl.addEventListener('dragover', this.dragOver.bind(this, 'event', eventEl, startDate, event.duration));

        return eventEl;
    }

    dragStartEvent(event, eventEl, e) {
        e.dataTransfer.setDragImage(eventEl, 0, 0);
        this.state.draggedEvent = event;
        this.state.draggedEventEL = eventEl;

        this.newTimeEl = document.createElement('div');
        this.newTimeEl.className = 'day-view__time day-view__time--new-time';

        this.bodyEl.append(this.newTimeEl);
    }

    dragEndEvent(event, eventEl, e) {
        console.log('dragEndEvent', event );
        e.preventDefault();
        e.stopPropagation();
    }

    dropHandler(e) {
        // prevent default action (open as link for some elements)
        e.preventDefault();
        e.stopPropagation();

        this.newTimeEl.remove();
        this.newTimeEl = null;

        if (this.state.currentHourEl) {
            this.state.currentHourEl.classList.remove('day-view__item--drag-over');
            this.state.currentHourEl = null;
        }

        if (this.state.newTime) {
            this.state.draggedEvent.startDate = this.state.newTime.toJSON();

            this.state.draggedEvent = null;
            this.state.draggedEventEL = null;

            this.render();
        }
    }

    dragOver(type, el, startDate, duration, e) {
        e.preventDefault();

        const { clientY } = e;
        const { top, height } = el.getBoundingClientRect();
        const elementTop = clientY - top;
        const shiftTime = elementTop * duration / height;
        const newTime = new Date(startDate);

        newTime.setMinutes( newTime.getMinutes() + shiftTime );

        const hh = newTime.getHours().toString().padStart(2, '0');
        const mm = newTime.getMinutes().toString().padStart(2, '0');
        const { top: bodyTop } = this.bodyEl.getBoundingClientRect();
        const currentHourEl = this.hoursCollection[newTime.getHours()];

        this.newTimeEl.innerText = `${hh}:${mm}`;
        this.newTimeEl.style.top = `${clientY - bodyTop}px`;
        this.state.newTime = newTime;

        if (this.state.currentHourEl && this.state.currentHourEl !== currentHourEl) {
            this.state.currentHourEl.classList.remove('day-view__item--drag-over');
        }

        this.state.currentHourEl = currentHourEl;
        this.state.currentHourEl.classList.add('day-view__item--drag-over');
    }

    renderEvents(events) {
        return events.map(e => this.renderEvent(e));
    }

    renderBody() {
        const elements = [];
        const events = this.getCurrentSchedule();

        this.hoursCollection = {};

        if (events) {
            events.forEach(e => elements.push(this.renderEvent(e)));
        }

        for (let hh=9; hh <= 20; hh++) {
            const hourElement = this.createHour(hh);

            this.hoursCollection[hh] = hourElement;
            elements.push(hourElement);
        }

        this.bodyEl.innerText = '';
        this.bodyEl.append(...elements);
    }

    render() {
        this.renderTitle();
        this.renderBody();
    }
}
