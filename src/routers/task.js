const express = require('express')
const router = new express.Router()
const authentication = require('../middleware/authentication')
const Task = require('../models/task');

// Create task
router.post('/tasks', authentication, async (req, res) => {
    try {
        // const task =  await new Task(req.body);
        const task = new Task({
            // Grab the entire req body
            ...req.body,
            author: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

// Read tasks - GET /tasks?completed=true
// Limit/skip tasks - GET /task?limit=value&skip=value
// Sort tasks - GET /task?sortBy=value_asc or /task?sortBy=value_desc
router.get('/tasks', authentication, async (req, res) => {
    const isCompleted = req.query.completed
    const limit = req.query.limit
    const skip = req.query.skip
    const sortRequest= req.query.sortBy
    const sort = {}
    const match = {}

    // Check if '?completed' is part of the URL. 
    if (isCompleted) {
        match.completed = isCompleted === 'true'
    }

    if (sortRequest) {
        const parts = sortRequest.split('_')
        // Sorting by asc is 1 and desc is -1
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'userTasks',
            match: match,
            options: {
                // Mongoose will ignore it if the value is not a number
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort: sort
            }
        }).execPopulate()
        
        res.send(req.user.userTasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Read single task
router.get('/tasks/:id', authentication, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id: _id, author: req.user._id })
        if (!task) return res.status(404).send()

        res.send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Update single task
router.patch('/tasks/:id', authentication, async (req, res) => {
    // Convert req.body object to an array of properties
    const taskUpdates = Object.keys(req.body)
    // Define what properties are allowed to be updated
    const allowedTaskUpdates = ['description', 'completed']
    const isTaskOperationValid = taskUpdates.every((update) => {
        return allowedTaskUpdates.includes(update)
    })

    if (!isTaskOperationValid) return res.status(400).send({ error: 'Invalid update' })

    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })
        
        if(!task) return res.status(404).send()
        
        // Loop through the request body object and update the values to what the user inputs.
        taskUpdates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        
        res.send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

// Delete single task
router.delete('/tasks/:id', authentication, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id })
        if (!task) return res.status(404).send()

        res.send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router