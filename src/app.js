const express = require('express');
require('./db/mongoose');
const cors = require('cors')
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(cors());

// Set Express to automatically parse JSON so we can access it in request handlers
app.use(express.json())

// Register routers for users and tasks
app.use(userRouter)
app.use(taskRouter)

module.exports = app;