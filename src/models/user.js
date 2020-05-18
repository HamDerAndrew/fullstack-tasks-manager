const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(pass) {
            if(pass.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Create a method for handling JSON Webtokens
// userSchema.methods are available on the instances - also called Instance Methods
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisasecretnode')

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}

// Setup a virtual property so Mongoose can link tasks with a User
userSchema.virtual('userTasks', {
    // Link Task model
    ref: 'Task',
    // Associate 'User._id' with 'Task.author._id'
    localField: '_id',
    // The name of the field in the Task model to link with localField in User
    foreignField: 'author'
})

// Create method for hiding the full profile info (like password, list of tokens etc.) and only display 'public' info.
// Here we are utilizing the 'toJSON' method that's available on JavaScript objects. This method is allows you to decide which data
// comes back with the object after it is stringified. Behind the scenes in Express, all response.send() are stringified.
// More info about it: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior
userSchema.methods.toJSON =  function () {
    const user = this
    // Use mongoose's 'toObject()' method to turn the user data into plain JavaScript object
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Create a method in the User model with 'userSchema.statics.nameOfMethod'
// userSchema.statics methods are accessible on the Model - also called Model Methods
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})
    if (!user) throw new Error('Unable to log in')

    const isAMatch = await bcrypt.compare(password, user.password)
    if (!isAMatch) throw new Error('Unable to log in')

    return user
}

// Setup middleware. 
// Using a normal function because the 'this' binding is crucial here. Arrow functions don't bind 'this'
userSchema.pre('save', async function (next) {
    //'this' is equal to the document that's being saved. It gives access to the indiviual 'user' that's about to be saved.
    const user = this

    // Update password hash if modified/changed by the user.
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // Make sure to call 'next()' - else the code will just 'hang' and think we aren't done.
    next()
})

// Delete a user's tasks if the user profile is deleted/removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ author: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;