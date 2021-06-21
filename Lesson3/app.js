import { Schedule } from './schedule.js'; // exports.default

function getDisplayedDate() {
    const params = new URLSearchParams(window.location.search);

    return params.get('day');
}

const displayedDate = getDisplayedDate();
// eslint-disable-next-line no-undef
const calendar = new Calendar(displayedDate);
// eslint-disable-next-line no-undef
const schedule = new Schedule(displayedDate);

console.log(calendar, schedule, displayedDate);
