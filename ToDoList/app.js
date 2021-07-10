import Notifications from './notifications.js';
import AddTaskForm from './addTaskForm.js';
import Task from './task.js';
import Filter from './filter.js';
import TasksAPI from './tasksAPI.js';
import Pagination from './pagination.js';
import Counter from './counter.js';

const notifications = new Notifications();
const addTask = new AddTaskForm();
const filter = new Filter( onFilterChange );
const api = new TasksAPI();
const pagination = new Pagination(document.querySelector('.pagination'));
const counter = new Counter();
const todoListEl = document.querySelector('.todo-list');
let tasks = [];

addTask.addEventListener('complete', onCompleteAllStatusChange);
addTask.addEventListener('addTask', onAddTask);

console.log( pagination );

// addLocalTasks(readTasks());

window.addEventListener('popstate', onPageChange);
pagination.onChange = onPageChange;

putTitle();
counter.render();
console.log('page loaded');
getTaskFromServer();
pagination.render();

function onPageChange() {
    filter.changeFilter(location.hash);
    tasks = [];
    console.log('page changed');
    getTaskFromServer();
    pagination.render();
    putTitle();
}

function putTitle() {
    document.title = `ToDo List. Page ${pagination.page}. Filter: ${filter.value}`;
}

function getTaskFromServer() {
    console.log('getTaskFromServer');
    const params = {
        page: pagination.page,
        limit: pagination.limit,
    };

    if (filter.value === '#/completed') {
        params.completed = true;
    } else if (filter.value === '#/active') {
        params.completed = false;
    }

    return api.getTasks(params)
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
    tasks = [];
    console.log('filter change');
    getTaskFromServer();
    pagination.render();
    putTitle();
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
        console.log('task changed');
        await getTaskFromServer();
    } catch(error) {
        console.log(error);
    }
    // renderTasks(tasks);
}

function onTaskDestroy(task) {
    api.deleteTask(task.data.id)
        .then(onFilterChange)
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
    const shownTasks = sortedTasks.filter(t => isTaskShown(t));

    todoListEl.innerText = '';
    // todoListEl.append.apply(todoListEl, shownTasks);
    counter.setValues(
        shownTasks.length,
        shownTasks.filter(t => t.data.completed).length
    );
    todoListEl.append(...shownTasks.map(t => t.render()));
}
