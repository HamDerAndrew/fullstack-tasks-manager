const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.port || 3000

// Set Express to automatically parse JSON so we can access it in request handlers
app.use(express.json())

// Create users
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user)
    } catch(error) {
        res.status(400).send(error)
    }
})

// Read users
app.get('/users', async (req, res) => {
    try {
        // Using an empty object with .find() fetches all users
        const users = await User.find({})
        res.send(users)
    } catch(error) {
        res.status(500).send()
    }
})

// Read single user
app.get('/users/:id', async (req, res) => {
    //use Express' 'req.params' to access the dynamic '/:id' value
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send()

        res.send(user)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Create task
app.post('/tasks', async (req, res) => {
    try {
        const task =  await new Task(req.body);
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})


// Read tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Read single task
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await Task.findById(_id)
        if (!user) return res.status(404).send()

        res.send(user)
    } catch(error) {
        res.status(500).send(error)
    }
})


app.listen(port, () => {
    console.log("Server up and running on:", port)
})