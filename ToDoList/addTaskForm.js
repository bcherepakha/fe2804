export default class AddTaskForm {
    constructor( onCompleteAllStatusChange, onAddTask ) {
        this.props = {};
        this.form = document.querySelector('.header');
        this.completeAllEl = this.form.querySelector('.complete-all');
        this.inputEl = this.form.querySelector('.new-todo');

        if (onCompleteAllStatusChange) {
            this.completeAllEl.addEventListener('change', onCompleteAllStatusChange);
        }

        if (onAddTask) {
            this.props.onAddTask = onAddTask;
        }

        this.form.addEventListener('submit', this.addTask.bind(this));
    }

    addTask(e) {
        e.preventDefault();
        const task = {
            completed: this.getCompleteStatus(),
            text: this.getInputValue().trim()
        };

        if (task.text.length < 3) {
            this.hasError = true;
            this.render();

            if (this.props.onAddTask) {
                this.props.onAddTask('error');
            }

            return ;
        }

        this.hasError = false;
        this.inputEl.value = '';

        this.render();

        if (this.props.onAddTask) {
            this.props.onAddTask('success', task);
        }
    }

    getCompleteStatus() {
        return this.completeAllEl.checked;
    }

    getInputValue() {
        return this.inputEl.value;
    }

    addEventListener(eventName, eventAction) {
        switch (eventName) {
        case 'complete':
            this.completeAllEl.addEventListener('change', eventAction);
            break;
        case 'addTask':
            this.props.onAddTask = eventAction;
            break;
        }
    }

    render() {
        if (this.hasError) {
            this.form.classList.add('error');
        } else {
            this.form.classList.remove('error');
        }
    }
}
