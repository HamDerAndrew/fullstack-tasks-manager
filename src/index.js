const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.port || 3000

// // Middleware function
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET request disabled')
//     } else {
//         next()
//     }
// })

// Maintenance mode - disable all requests on every single routehandler.
// app.use((req, res, next) => {
//     res.status(503).send('Maintenance mode on. We are back shortly')
// })

// Set Express to automatically parse JSON so we can access it in request handlers
app.use(express.json())

// Register routers for users and tasks
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server up and running on:", port)
})