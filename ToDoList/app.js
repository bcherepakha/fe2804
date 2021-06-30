import Notifications from './notifications.js';
import AddTaskForm from './addTaskForm.js';
import Task from './task.js';

const notifications = new Notifications();
const addTask = new AddTaskForm();
const todoListEl = document.querySelector('.todo-list');
let tasks = readTasks();

addTask.addEventListener('complete', onCompleteAllStatusChange);
addTask.addEventListener('addTask', onAddTask);

renderTasks();

function onCompleteAllStatusChange() {
    console.log( addTask.getCompleteStatus() );
}

function onAddTask(status, taskData) {
    if (status === 'error') {
        notifications.addNote('please use more than 3 symbols in task text', 'error')
            .removeAfter(3000);
    } else if (status === 'success' || status === 'render') {
        const task = new Task(taskData);

        if (status === 'success') {
            tasks.push(taskData);
            saveTasks();
        }

        todoListEl.append( task.render() );
    }
}

function saveTasks() {
    localStorage.tasks = JSON.stringify(tasks);
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

function renderTasks() {
    todoListEl.innerText = '';

    tasks.forEach(task => onAddTask('render', task));
}
