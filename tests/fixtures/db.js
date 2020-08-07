const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Fane Bantuiala',
    email: 'fanebantuiala@gmail.com',
    password: 'anamere',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET, { expiresIn: '1 day'})
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Mariut Baiatuvetel',
    email: 'mariutvetel@gmail.com',
    password: 'anamere123',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET, { expiresIn: '1 day'})
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany(); // empty test database
    await Task.deleteMany(); // empty test database

    await new User(userOne).save();
    await new User(userTwo).save();

    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
};