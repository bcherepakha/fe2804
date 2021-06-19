function Calendar(day) {
    const currentDate = this.createDate();
    let displayedDate;

    if (day) {
        const [y, m, d] = day.split('-')
            .map(s => parseInt(s, 10));

        if (y > 0 && m > 0 && d > 0) {
            displayedDate = this.createDate(y, m - 1, d);
        }
    }

    this.state = {
        currentDate,
        displayedDate,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear()
    };

    this.root = document.querySelector('.calendar');
    this.title = this.root.querySelector('.calendar__title');
    this.prevBtn = this.root.querySelector('.calendar__btn--prev');
    this.nextBtn = this.root.querySelector('.calendar__btn--next');
    this.days = this.root.querySelector('.calendar__days');

    this.prevBtn.addEventListener('click', this.prevMonth.bind(this));
    this.nextBtn.addEventListener('click', this.nextMonth.bind(this));

    this.render();
}

Calendar.MONTHES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

Calendar.prototype.createDate = function (year, month, day) {
    const d = arguments.length === 0 ? new Date() : new Date(year, month, day);

    d.setHours(12);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d;
};

Calendar.prototype.setMonth = function (month, year = this.state.year) {
    const newDate = new Date(this.state.currentDate);

    newDate.setFullYear(year);
    newDate.setMonth(month);

    this.state = Object.assign({}, this.state, {
        month: newDate.getMonth(),
        year: newDate.getFullYear()
    });

    this.render();
};

Calendar.prototype.nextMonth = function () {
    this.setMonth(this.state.month + 1, this.state.year);
};

Calendar.prototype.prevMonth = function () {
    this.setMonth(this.state.month - 1, this.state.year);
};

Calendar.prototype.createDay = function (renderDate) {
    const el = document.createElement('li');
    const link = document.createElement('a');

    link.innerText = renderDate.getDate();
    link.href = `?day=${renderDate.toJSON().split('T')[0]}`;
    el.append(link);
    el.className = 'calendar__day';

    if (renderDate.getTime() === this.state.currentDate.getTime()) {
        el.classList.add('calendar__day--current');
    }

    if (renderDate.getMonth() !== this.state.month) {
        el.classList.add('calendar__day--not-in-month');
    }

    if (this.state.displayedDate && renderDate.getTime() === this.state.displayedDate.getTime()) {
        el.classList.add('calendar__day--displayed');
    }

    return el;
};

Calendar.prototype.renderDays = function () {
    const { month, year } = this.state;
    const lastDayOfCurrentMonth = this.createDate(year, month + 1, 0);
    const firstDayOfCurrentMonth = this.createDate(year, month, 1);
    const startShift = (firstDayOfCurrentMonth.getDay() + 6) % 7;
    const firstDisplayDay = this.createDate(year, month, 1 - startShift);
    const endShift = (7 - lastDayOfCurrentMonth.getDay()) % 7;
    const lastDisplayDay = this.createDate(year, month + 1, endShift);
    const days = [];

    for (
        let currentDate = new Date(firstDisplayDay);
        currentDate.getTime() <= lastDisplayDay.getTime();
        currentDate.setDate( currentDate.getDate() + 1)) {
        days.push(
            this.createDay( currentDate )
        );
    }

    this.days.innerText = '';
    // this.days.append.apply(this.days, days);
    this.days.append(...days);
};

Calendar.prototype.render = function () {
    const { month, year } = this.state;

    this.title.innerText = `${Calendar.MONTHES[month]} ${year}`;

    this.renderDays();
};
