function dbClick(clickHandler, DB_CLICK_TIME = 600) {
    let _lastClickTime = 0;

    return function (e) {
        const currentTime = Date.now();

        if (currentTime - _lastClickTime < DB_CLICK_TIME) {
            _lastClickTime = 0;
            return clickHandler(e);
        } else {
            _lastClickTime = currentTime;
        }
    }
}

export default class Task {
    constructor(data) {
        this.data = {
            ...data
        };

        this.events = {};
        this.edit = false;

        this.createEl();
    }

    createEl() {
        const el = document.createElement('li');
        const editForm = document.createElement('form');
        const editInput = document.createElement('input');
        const changeBtn = document.createElement('button');

        el.innerHTML = `
            <div class="view">
                <input class="toggle" type="checkbox">
                <span></span>
                <button class="destroy"></button>
            </div>
        `;

        const toggleCheckbox = el.querySelector('.toggle');
        const destroyBtn = el.querySelector('.destroy');
        const textEl = el.querySelector('.view > span');

        editForm.noValidate = true;
        toggleCheckbox.checked = this.data.completed;
        textEl.innerText = this.data.text;
        editInput.value = this.data.text;
        editInput.minLength = 5;
        editInput.required = true;
        editInput.placeholder = 'Task text must be more than 3 symbol';

        editForm.append(editInput, changeBtn);
        el.append(editForm);

        editInput.className = 'edit';
        changeBtn.className = 'visually-hidden';
        changeBtn.type = 'submit';

        toggleCheckbox.addEventListener('change', this.onCompleteToggle.bind(this));
        destroyBtn.addEventListener('click', this.destroyHandler.bind(this));
        textEl.addEventListener(
            'click',
            dbClick(this.textClickHandler.bind(this))
        );
        editForm.addEventListener('submit', this.submitEditing.bind(this));
        editInput.addEventListener('keypress', this.editKeyPress.bind(this));

        window.addEventListener('click', (e) => {
            if (!this.edit) {
                return true;
            }

            if (e.target && e.target.closest('li') !== el) {
                this.edit = false;
                this.render();
            }
        });

        this.toggleCheckbox = toggleCheckbox;
        this.editInput = editInput;
        this.editForm = editForm;
        this.textEl = textEl;
        this.root = el;
    }

    destroyHandler() {
        this.root.remove();
        this.trigger('destroy');
    }

    onCompleteToggle() {
        this.data = {
            ...this.data,
            completed: this.toggleCheckbox.checked
        };

        if (this.events.change) {
            this.events.change.forEach(callback => callback(this));
        }

        this.render();
    }

    textClickHandler(e) {
        this.edit = true;
        this.render();
    }

    submitEditing(e) {
        e.preventDefault();
        const { value } = this.editInput;

        if (!this.editInput.checkValidity()) {
            // this.editInput.classList.add('error');
            // this.editInput.setCustomValidity('Task text must be more than 3 symbol');

            const errorTextEl = this.editForm.querySelector('.errorText')
                || document.createElement('p');

            errorTextEl.className = 'errorText';
            errorTextEl.innerText = 'Task text must be more than 3 symbol';

            this.editForm.append(errorTextEl);

            return ;
        } else {
            // this.editInput.classList.remove('error');
            // this.editInput.setCustomValidity('');
            const errorTextEl = this.editForm.querySelector('.errorText');

            if (errorTextEl) {
                errorTextEl.remove();
            }
        }

        this.data = {
            ...this.data,
            text: value
        };
        this.edit = false;

        if (this.events.change) {
            this.events.change.forEach(callback => callback(this));
        }

        this.render();
    }

    editKeyPress(e) {
        if (e.ctrlKey && e.which === 10) {
            this.edit = false;
            this.render();
        }
    }

    addEventListener(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
    }

    trigger(eventName) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(this));
        }
    }

    render() {
        this.toggleCheckbox.checked = this.data.completed;
        this.editInput.setAttribute('value', this.data.text);
        this.textEl.innerText = this.data.text;
        this.editInput.value = this.data.text;

        if (this.data.completed) {
            this.root.classList.add('completed');
        } else {
            this.root.classList.remove('completed');
        }

        if (this.edit) {
            this.root.classList.add('editing');
            this.editInput.focus();
        } else {
            this.root.classList.remove('editing');
        }

        return this.root;
    }
}
