const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = require('../../src/models/user');

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

const setupDb = async () => {
    // Empty database before test so we don't have to create different users each time we test
    await User.deleteMany()
    // Create new user to test on
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setupDb
}