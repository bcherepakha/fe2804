export default class TasksAPI {
    constructor() {
        this.base = 'https://5d9969125641430014051850.mockapi.io/tasks';
    }

    getTasks({ page, limit } = {}) {
        const params = new URLSearchParams();

        if (page) {
            params.append('page', page);
        }

        if (limit) {
            params.append('limit', limit);
        }

        return fetch(`${this.base}?${params.toString()}`)
            .then(response => response.json())
            // .then(tasksData => tasksData)
            .catch((err) => {
                console.log('GET', this.base, err);
            });
    }

    deleteTask(taskID) {
        return fetch(`${this.base}/${taskID}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }

                return response.text()
                    // eslint-disable-next-line no-undef
                    .then(text => Promise.reject(text));
            });
    }

    addTask(taskData) {
        return fetch(this.base, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(taskData)
        })
            .then(response => response.json());
    }

    changeTask(taskData) {
        return fetch(`${this.base}/${taskData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(taskData)
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }

                return response.text()
                    // eslint-disable-next-line no-undef
                    .then(text => Promise.reject(text));
            });
    }
}
