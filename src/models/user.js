const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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

const User = mongoose.model('User', userSchema)

module.exports = User;