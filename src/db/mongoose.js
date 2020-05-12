const mongoose = require('mongoose');

// create connection string AND database name after portnumber
const connectionUrl = 'mongodb://127.0.0.1:27017/task-manager-api'

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})