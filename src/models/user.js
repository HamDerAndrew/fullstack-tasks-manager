const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
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
    }
})

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