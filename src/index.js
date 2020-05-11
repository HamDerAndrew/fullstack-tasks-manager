const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.port || 3000

// Set Express to automatically parse JSON so we can access it in request handlers
app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then((result) => {
        res.send(user)
    }).catch((error) =>{
        res.status(400).send(error)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then((result) => {
        res.send(task)
    }).catch((error) =>{
        res.status(400).send(error)
        console.log(error)
    })
})

app.listen(port, () => {
    console.log("Port up and running on:", port)
})