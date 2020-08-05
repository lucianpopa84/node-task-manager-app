// CRUD create read update delete

const mongodb = require('mongodb');

const { MongoClient, ObjectID } = mongodb;

const id = new ObjectID();
// console.log('id: ' + id);
// console.log('id timestamp: ' + id.getTimestamp());

// Connection URL
const connectionUrl = 'mongodb://127.0.0.1:27017';
 
// Database Name
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
       return console.log('Unable to connect to database!');
    } 

    console.log('Connected to DB');

    const db = client.db(databaseName);

    // ====== CREATE ======

    // db.collection('users').insertOne({
    //     name: 'Lucian',
    //     age: 36
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('unable to insert user');
    //     };
    //     console.log('inserted ' + JSON.stringify(result.ops));
    // });


    // db.collection('users').insertMany([
    //     {
    //         name: 'Mihaela',
    //         age: 29
    //     },
    //     {
    //         name: 'Madalina',
    //         age: 28
    //     },
    //     {
    //         name: 'Dan',
    //         age: 54
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('unable to insert user(s)');
    //     };
    //     console.log('inserted ' + JSON.stringify(result.ops));
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Buy stuff',
    //         completed: true
    //     },
    //     {
    //         description: 'Go to doctor',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert task(s)!');
    //     };
    //     console.log('inserted ' + JSON.stringify(result.ops));
    // })

    // ====== READ ======

    // db.collection('users').findOne({ _id: new ObjectID("5f1565245160fa82d8c11ec7") }, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch!');
    //     }
    //     console.log('user: ' + JSON.stringify(user));
    // });

    // db.collection('users').find({ age:  36}).toArray((error, users) => {
    //         if (error) {
    //             return console.log('Unable to fetch!');
    //         }
    //         console.log('user: ' + JSON.stringify(users));
    // })

    // db.collection('users').find({ age:  36}).count((error, count) => {
    //     if (error) {
    //         return console.log('Unable to count!');
    //     }
    //     console.log('count: ' + count);
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("5f15754295ee48ab2035aba2") }, (error, task) => {
    //     if (error) {
    //         return console.log('Unable to fetch!');
    //     }
    //     console.log('task: ' + JSON.stringify(task));
    // });

    // db.collection('tasks').find({ completed: false}).toArray((error, tasks) => {
    //     if (error) {
    //         return console.log('Unable to fetch!');
    //     }
    //     tasks.forEach((task) => console.log(JSON.stringify(task)))
    // });

    // ====== UPDATE ======

    // db.collection('users').updateOne({ _id: new ObjectID("5f1565245160fa82d8c11ec7") }, {
    //     $set: {
    //         name: 'Dan'
    //     },
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log('matched: ' + result.matchedCount + '\t modified: ' + result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // });

    // db.collection('tasks').updateMany({ completed: false }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log('matched: ' + result.matchedCount + '\t modified: ' + result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // });


    // ====== DELETE ======

    // db.collection('users').deleteMany({ 
    //     age: 54
    // }).then((result) => {
    //     console.log('deleted: ' + result.deletedCount)
    // }).catch((error) => {
    //     console.log(error)
    // });

    // db.collection('users').deleteOne({ 
    //     _id: new ObjectID("5f169b2c3d2acf5bb0dcda90") 
    // }).then((result) => {
    //     console.log('deleted: ' + result.deletedCount)
    // }).catch((error) => {
    //     console.log(error)
    // });

    // db.collection('tasks').deleteOne({ description: 'Go to doctor' }).then((result) => {
    //     console.log('deleted: ' + result.deletedCount);
    // }).catch((error) => {
    //     console.log(error);
    // });

})