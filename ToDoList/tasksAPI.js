export default class TasksAPI {
    constructor() {
        this.base = 'https://5d9969125641430014051850.mockapi.io/tasks';
    }

    getTasks() {
        return fetch(this.base)
            .then(response => response.json())
            // .then(tasksData => tasksData)
            .catch((err) => {
                console.log('GET', this.base, err);
            });
    }
}
