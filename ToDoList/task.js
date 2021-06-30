export default class Task {
    constructor(data) {
        this.data = data;

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

        toggleCheckbox.checked = this.data.completed;
        textEl.innerText = this.data.text;
        editInput.value = this.data.text;

        editForm.append(editInput, changeBtn);
        el.append(editForm);

        editInput.className = 'edit';
        changeBtn.className = 'visually-hidden';
        changeBtn.type = 'submit';

        toggleCheckbox.addEventListener('change', this.onCompleteToggle.bind(this));
        destroyBtn.addEventListener('click', this.destroyHandler.bind(this));

        this.toggleCheckbox = toggleCheckbox;
        this.root = el;
    }

    destroyHandler() {
        this.root.remove();
    }

    onCompleteToggle() {
        this.data.completed = this.toggleCheckbox.checked;
        this.render();
    }

    render() {
        this.toggleCheckbox.checked = this.data.completed;

        if (this.data.completed) {
            this.root.classList.add('completed');
        } else {
            this.root.classList.remove('completed');
        }

        return this.root;
    }
}
