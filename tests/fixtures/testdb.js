const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Batman',
    email: 'batman@batcave.com',
    password: 'imbatman',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JSON_SECRET_STRING )
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Superman',
    email: 'superman@justiceleague.com',
    password: 'imsuperman',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JSON_SECRET_STRING )
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'this is a test description',
    completed: false,
    author: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Here is the second test description',
    completed: true,
    author: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First test task for userTwo',
    completed: true,
    author: userTwo._id
}

const setupDb = async () => {
    // Empty database before test so we don't have to create different users each time we test
    await User.deleteMany()
    await Task.deleteMany()
    // Create new user to test on
    await new User(userOne).save()
    await new User(userTwo).save()
    // Create new tasks to test on
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    setupDb
}