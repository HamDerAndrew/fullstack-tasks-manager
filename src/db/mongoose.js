const mongoose = require('mongoose');

// create connection string AND database name after portnumber
const connectionUrl = process.env.MONGO_DATABASE_URL

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})