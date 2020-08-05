const mongoose = require('mongoose');

// Connection URL
const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// const me = new User({
//     name: '  Georgel  ',
//     email: 'GEO@mymail.com',
//     password: '     anamere123'
// });

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log('' + error);
// });

// const myTask = new Task({
//     description: 'Learn Mongoose validation'
// });

// myTask.save().then(() => {
//     console.log(myTask);
// }).catch((error) => {
//     console.log('' + error);
// });