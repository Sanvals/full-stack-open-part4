const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')

const api = supertest(app)

test('2 blog posts are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blog posts', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
})

test.only('id is the primary identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(b => {
        assert.strictEqual("id" in b, true)
    })
})

after(async () => {
    await mongoose.connection.close()
})