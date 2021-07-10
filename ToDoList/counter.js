export default class Counter {
    constructor() {
        const [leftEl, completedEl] = Array.from(document.querySelectorAll('.todo-count strong'));

        this.leftEl = leftEl;
        this.completedEl = completedEl;
    }

    setValues(left, completed) {
        this.left = left;
        this.completed = completed;

        this.render();
    }

    render() {
        this.leftEl.innerText = this.left || 0;
        this.completedEl.innerText = this.completed || 0;
    }
}
