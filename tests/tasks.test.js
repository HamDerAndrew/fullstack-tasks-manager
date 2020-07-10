const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOne, userTwo, taskOne, setupDb } = require('./fixtures/testdb');
const { send } = require('@sendgrid/mail');

// Jest globals
// Runs once for each testcase in this testsuite
beforeEach(setupDb)

test('Should create a task for the user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test received from testcode'
        })
        .expect(201)

        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toBe(false)
})

test('Should fetch all tasks for the user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        // Check that there are two tasks for userOne
        const tasks = await response.body
        expect(tasks.length).toBe(2)
})

test('Should not delete task since the user is not the author of the task', async () => {
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    // Check that the task is still there
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})