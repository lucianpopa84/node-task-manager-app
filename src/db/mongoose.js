const mongoose = require('mongoose');

// Connection URL
const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});