const express = require('express');
require('./db/mongoose');
const cors = require('cors')
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT

app.use(cors());

// Set Express to automatically parse JSON so we can access it in request handlers
app.use(express.json())

// Register routers for users and tasks
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server up and running on:", port)
})