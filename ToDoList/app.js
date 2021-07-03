import Notifications from './notifications.js';
import AddTaskForm from './addTaskForm.js';
import Task from './task.js';

const notifications = new Notifications();
const addTask = new AddTaskForm();
const todoListEl = document.querySelector('.todo-list');
let tasks = [];

addTask.addEventListener('complete', onCompleteAllStatusChange);
addTask.addEventListener('addTask', onAddTask);

renderTasks(readTasks());

function onCompleteAllStatusChange() {
    console.log( addTask.getCompleteStatus() );
}

function onAddTask(status, taskData) {
    if (status === 'error') {
        notifications.addNote('please use more than 3 symbols in task text', 'error')
            .removeAfter(3000);
    } else if (typeof taskData !== 'object'
        || taskData === null
        || typeof taskData.text !== 'string'
        || typeof taskData.completed !== 'boolean') {
        console.log('wrong data');
    } else if (status === 'success' || status === 'render') {
        const task = new Task(taskData);

        task.addEventListener('change', onTaskChange);
        task.addEventListener('destroy', onTaskDestroy);

        tasks.push(task);

        if (status === 'success') {
            saveTasks();
        }

        todoListEl.append( task.render() );
    }
}

function onTaskChange(task) {
    console.log(task);
    saveTasks();
}

function onTaskDestroy(task) {
    tasks = tasks.filter(t => t !== task);

    saveTasks();
}

function saveTasks() {
    localStorage.tasks = JSON.stringify(
        tasks.map(task => task.data)
    );
}

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

function renderTasks(tasks) {
    todoListEl.innerText = '';

    tasks.forEach(task => onAddTask('render', task));
}
