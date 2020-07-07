const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: 'Batman',
    email: 'batman@batcave.com',
    password: 'imbatman'
}

// Jest globals
// Runs once for each testcase in this testsuite
beforeEach(async () => {
    // Empty database before test so we don't have to create different users each time we test
    await User.deleteMany()
    // Create new user to test on
    await new User(userOne).save()
})


test('Should sign up new user', async () => {
    // pass in 'app' and send request
    await request(app).post('/users').send({
        name: 'André',
        email: 'andrewtest@example.com',
        password: 'test123'
    })
    .expect(201)
})