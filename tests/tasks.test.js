const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOne, userOneId, setupDb } = require('./fixtures/testdb');
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