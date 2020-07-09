const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOne, userOneId, setupDb } = require('./fixtures/testdb');
const { send } = require('@sendgrid/mail');

// Jest globals
// Runs once for each testcase in this testsuite
beforeEach(setupDb)

test('Should create a task for the user', async () => {

})