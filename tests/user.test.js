const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Batman',
    email: 'batman@batcave.com',
    password: 'imbatman',
    // avatar: './fixtures/profile-pic.jpg',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JSON_SECRET_STRING )
    }]
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
    // saving the 'response' in a variable gives access to the response body aswell
    const response = await request(app)
        .post('/users')
        .send({
            name: 'André',
            email: 'andrewtest@example.com',
            password: 'test123'
         })
        .expect(201)

    // Check/Assert that user is created correctly in the database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Check/Assert info about the response body
    expect(response.body).toMatchObject({
        user: {
            name: 'André',
            email: 'andrewtest@example.com'
        },
        token: user.tokens[0].token
    })

    // Check that user password is not stored as plain text
    expect(user.password).not.toBe('test123')
})

test('Should login an existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

    // Check/Assert that the response matches the users second token, which is created upon logins
    const user = await User.findById(userOneId)
    expect(user.tokens[1].token).toBe(user.tokens[1].token)
})

test('Should not login user if user doesn\'t exist', async () => {
    await request(app).post('/users/login').send({
        email: 'notvalid@example.com',
        password: 'thisisnotvalid'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/user')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get a user profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/user')
        .send()
        .expect(401)
})

test('Should delete authenticated user\'s account', async () => {
    const response = await request(app)
        .delete('/users/user')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user\'s account', async () => {
    await request(app)
        .delete('/users/user')
        .send()
        .expect(401)
})

test('Should upload avatar img', async () => {
    await request(app)
        .post('/users/user/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        // 'attach()' takes two string arguments: the form field we are trying to set, and the location of the file to use
        .attach('avatarImg', 'tests/fixtures/avatar-default.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    // Using 'toEqual' because we are comparing two empty objects. They are not the same because they are each created as different objects in memory
    // expect({}).toEqual({})
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid fields on user', async () => {
    await request(app)
        .patch('/users/user')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Ekko'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Ekko')
})

test('Should not update invalid fields on user', async () => {
    await request(app)
        .patch('/users/user')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Republic Fleet'
        })
        .expect(400)
})