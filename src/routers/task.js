const express = require('express')
const router = new express.Router()
const Task = require('../models/task');

// Create task
router.post('/tasks', async (req, res) => {
    try {
        const task =  await new Task(req.body);
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

// Read tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Read single task
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await Task.findById(_id)
        if (!user) return res.status(404).send()

        res.send(user)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Update single task
router.patch('/tasks/:id', async (req, res) => {
    // Convert req.body object to an array of properties
    const taskUpdates = Object.keys(req.body)
    // Define what properties are allowed to be updated
    const allowedTaskUpdates = ['description', 'completed']
    const isTaskOperationValid = taskUpdates.every((update) => {
        return allowedTaskUpdates.includes(update)
    })

    if (!isTaskOperationValid) return res.status(400).send({ error: 'Invalid update' })

    try {
        const task = await Task.findById(req.params.id)

        // Loop through the request body object and update the values to what the user inputs.
        taskUpdates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task) return res.status(404).send()
        
        res.send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

// Delete single task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.status(404).send()

        res.send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router