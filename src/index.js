const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.port || 3000

// Set Express to automatically parse JSON so we can access it in request handlers
app.use(express.json())

// Create users
app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then((result) => {
        res.status(201).send(user)
    }).catch((error) =>{
        res.status(400).send(error)
    })
})

// Read users
app.get('/users', (req, res) => {
    // Using an empty object with .find() fetches all users
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) =>{
        res.status(500).send()
    })
})

// Read single user
app.get('/users/:id', (req, res) => {
    //use Express' 'req.params' to access the dynamic '/:id' value
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if (!user) return res.status(404).send()
        
        res.send(user)
    }).catch((error) => {
        res.status(500).send()
    })
})

// Create task
app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then((result) => {
        res.status(201).send(task)
    }).catch((error) =>{
        res.status(400).send(error)
        console.log(error)
    })
})


// Read tasks
app.get('/tasks', (req, res) => {
    Task.find({}).then((task) => {
        res.send(task)
    }).catch((error) => {
        res.status(500).send()
    })
})

// Read single task
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if (!task) return res.status(404).send()

        res.send(task)
    }).catch((error) => {
        res.status(500).send()
    })
})


app.listen(port, () => {
    console.log("Server up and running on:", port)
})