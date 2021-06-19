/* eslint-disable no-unused-vars */
function Schedule(day) {
    const currentDate = new Date(day);

    this.state = {
        day,
        currentDate,
    };

    this.render();
}

Schedule.prototype.getCurrentId = function() {
    return this.state.day;
};

Schedule.prototype.getCurrentSchedule =function() {
    // eslint-disable-next-line no-undef
    return MY_SCHEDULE[this.getCurrentId()];
};

Schedule.prototype.render = function() {
    const currentSchedule = this.getCurrentSchedule();

    console.log( currentSchedule );
};
