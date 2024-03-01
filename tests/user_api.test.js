const { test, after, afterEach, before, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const api = supertest(app)

before(async () => {
    await User.deleteMany({})
    console.log('cleared database')
})

beforeEach(async () => {
    await User.deleteMany({})
    
    const newUser = {
        username: "root",
        name: "root",
        password: "rootPassword"
    }

    await api.post('/api/users')
            .send(newUser)
})

test('user creation fails for non unique username', async () => {
    const newUser = {
        username: "root",
        name: "root",
        password: "rootPassword"
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(409)
})

test('user creation fails for short username', async () => {
    const newUser = {
        username: "ro",
        name: "root",
        password: "rootPassword"
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(400)
})

test('user creation fails for short password', async () => {
    const newUser = {
        username: "ro",
        name: "root",
        password: "ro"
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})