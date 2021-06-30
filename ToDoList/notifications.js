export default class Notifications {
    constructor() {
        this.rootEl = document.querySelector('.notes');
    }

    addNote(text, type) {
        const note = new Note(text, type);

        this.rootEl.append(note.root);

        return note;
    }
}

class Note {
    constructor(text, type, removeTime) {
        this.props = {
            text,
            type,
            removeTime
        };

        this.root = this.createElement();
    }

    createElement() {
        const el = document.createElement('div');

        el.className = 'note';
        el.innerText = this.props.text;

        if (this.props.type) {
            el.classList.add(this.props.type);
        }

        if (this.props.removeTime) {
            delay(this.props.removeTime)
                .then(function onSuccess() {
                    el.remove();
                });
        }

        return el;
    }

    removeAfter(ms) {
        delay(ms).then(() => this.root.remove());
    }

    remove() {
        this.root.remove();
    }
}

function delay(ms) {
    //* { [[status]]: 'pending', [[value]] }
    // eslint-disable-next-line no-undef
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
