const bcrypt = require('bcrypt');
const User = require('../models/user');
const assert = require('assert');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { test, beforeEach, after } = require('node:test');
const mongoose = require('mongoose');

beforeEach(async () => {
    await User.deleteMany({});
});

test('invalid username or password returns 400', async () => {
    const invalidUser = { 
        username: 'ab',
        name: 'Test User',
        password: '12'
    };

    const response = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

    assert.strictEqual(response.body.error, 'Username and password must be at least 3 characters long');
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, 0);
})

after(async () => {
    await User.deleteMany({});
    mongoose.connection.close();
});