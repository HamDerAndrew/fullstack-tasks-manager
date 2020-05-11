const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true,
        default: "This is a string default"
    },
    completed: {
        type: Boolean,
        default: false
    },
    secondarystuff: {
        type: String,
    }
})

module.exports = Task;