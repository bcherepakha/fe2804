import Notifications from './notifications.js';
import AddTaskForm from './addTaskForm.js';
import Task from './task.js';
import Filter from './filter.js';
import TasksAPI from './tasksAPI.js';
import Pagination from './pagination.js';

const notifications = new Notifications();
const addTask = new AddTaskForm();
const filter = new Filter( onFilterChange );
const api = new TasksAPI();
const pagination = new Pagination(document.querySelector('.pagination'));
const todoListEl = document.querySelector('.todo-list');
let tasks = [];

addTask.addEventListener('complete', onCompleteAllStatusChange);
addTask.addEventListener('addTask', onAddTask);

console.log( pagination );

pagination.render();

// addLocalTasks(readTasks());

getTaskFromServer();

function getTaskFromServer() {
    return api.getTasks({
            page: pagination.page,
            limit: pagination.limit
        })
        .then(tasksObj => {
            addLocalTasks(tasksObj);
        })
        .catch(() => {
            notifications.addNote('Server error', 'error');
        });
}

function onCompleteAllStatusChange() {
    console.log( addTask.getCompleteStatus() );
}

function onFilterChange() {
    renderTasks(tasks);
}

function isTaskShown(task) {
    switch(filter.value) {
    case '#/all':
        return true;
    case '#/completed':
        return task.data.completed;
    case '#/active':
        return !task.data.completed;
    }
}

function addTaskToStore(taskData) {
    const task = new Task(taskData);

    task.addEventListener('change', onTaskChange);
    task.addEventListener('destroy', onTaskDestroy);

    tasks.push(task);
}

async function onAddTask(status, taskData) {
    if (status === 'error') {
        notifications.addNote('please use more than 3 symbols in task text', 'error')
            .removeAfter(3000);
    } else if (typeof taskData !== 'object'
        || taskData === null
        || typeof taskData.text !== 'string'
        || typeof taskData.completed !== 'boolean') {
        console.log('wrong data');
    } else if (status === 'success' || status === 'render') {
        try {
            const serverTaskData  = await api.addTask(taskData);

            addTaskToStore(serverTaskData);
            renderTasks(tasks);
        } catch (error) {
            notifications.addNote('server error', 'error');
        }
    }
}

async function onTaskChange(task) {
    try {
        const newData = await api.changeTask(task.data);

        tasks = [];
        await getTaskFromServer();
    } catch(error) {
        console.log(error);
    }
    // renderTasks(tasks);
}

function onTaskDestroy(task) {
    api.deleteTask(task.data.id)
        .then(function onSuccess() {
            tasks = tasks.filter(t => t !== task);
            renderTasks(tasks);
        })
        .catch(function onError(error) {
            notifications.addNote(error, 'error');
            renderTasks(tasks);
        });
}

function saveTasks() {
    localStorage.tasks = JSON.stringify(
        tasks.map(task => task.data)
    );
}

// eslint-disable-next-line no-unused-vars
function readTasks() {
    if (localStorage.tasks) {
        try {
            const tasks = JSON.parse(localStorage.tasks);

            return tasks;
        } catch (ex) {
            return [];
        }
    }

    return [];
}

function addLocalTasks(tasksObj) {
    todoListEl.innerText = '';

    tasksObj.forEach(task => addTaskToStore(task));

    renderTasks(tasks);
}

function renderTasks(tasks) {
    const sortedTasks = [...tasks].sort(function(t1, t2) {
        const text1 = t1.data.text.toLowerCase();
        const text2 = t2.data.text.toLowerCase();

        if (text1 < text2) {
            return -1;
        } else if (text1 > text2) {
            return 1;
        } else {
            return 0;
        }
    });
    const shownTasks = sortedTasks.filter(t => isTaskShown(t))
        .map(t => t.render());

    todoListEl.innerText = '';
    // todoListEl.append.apply(todoListEl, shownTasks);
    todoListEl.append(...shownTasks);
}
