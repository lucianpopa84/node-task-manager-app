const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Lucian Popa',
        email: 'lucianpopa84@gmail.com',
        password: 'anamere'
    }).expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Lucian Popa',
            email: 'lucianpopa84@gmail.com',
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('anamere')
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    // Assert that token in response matches users second token
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'nonexisting@gmail.com',
        password: userOne.password
    }).expect(400);
});

test('Should not login user with bad credentials', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'badpassword'
    }).expect(400);
});

test('Should get own user profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get own user profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should not delete own user profile for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should delete own user profile for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert that user is removed from database
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200);

    // Assert that the user avatar is a Buffer (binary)
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));    
});

test('Should update valid user fields', async () => {
    const updates = {
        name: 'Estefan Bantuiala',
        age: 36
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(updates)
        .expect(200);

    // Assert that the updates were modified in the database
    const user = await User.findById(userOneId);
    expect(user.name).toEqual(updates.name); 
    expect(user.age).toEqual(updates.age);   
});

test('Should not update invalid user fields', async () => {
    const updates = {
        location: 'Craiova'
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(updates)
        .expect(400);  
});

