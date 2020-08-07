const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'New task from my test'
        })
        .expect(201);

    // Assert that the task was changed correctly in the database 
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should get all tasks for userOne correctly', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);

    // Assert that number of tasks in the response array is 2 
    expect(response.body.length).toEqual(2);
})

test('Should not delete other users task', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404);

    // Assert that taskOne is still in the database
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})