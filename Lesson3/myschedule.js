function createEvent( dateObj, duration, text, category ) {
    return {
        startDate: dateObj.toJSON(),
        duration,
        text,
        category
    };
}

// eslint-disable-next-line no-unused-vars
export const MY_SCHEDULE = {
    '2021-06-09': [
        createEvent(
            new Date(2021, 5, 9, 9, 0, 0, 0),
            90,
            'Meet Sophia in airport',
            'finance'
        ),
        createEvent(
            new Date(2021, 5, 9, 11, 0, 0, 0),
            120,
            'Studio workshop',
            'management'
        ),
        createEvent(
            new Date(2021, 5, 9, 17, 30, 0, 0),
            140,
            'Design workshop with Johny Ive',
            'workshop'
        ),
    ]
};
