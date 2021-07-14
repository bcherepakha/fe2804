import {getTaskFromServer} from './app.js';

mocha.setup('bdd');

/* global describe, it */
describe('get and render information from server', () => {
    it('get information and check the render', async () => {
        await getTaskFromServer();

        const taskColl = document.querySelectorAll('.todo-list li');

        console.log(taskColl);

        chai.assert.strictEqual(taskColl.length, 20);
    });
});

mocha.run();
