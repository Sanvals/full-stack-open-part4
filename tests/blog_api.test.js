const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')

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

test('id is the primary identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(b => {
        assert.strictEqual("id" in b, true)
    })
})

test.only('creates new blog via POST and checks the count', async () => {
    const prevCounter = await api.get('/api/blogs')
    const likesGenerator = Math.round(Math.random() * 100)
    
    const newBlog =
        {
            "title": "The Things 3",
            "author": "Arto",
            "url": "http://www.google.es",
            "likes": likesGenerator
        }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const afterCounter = await api.get('/api/blogs')
    
    // Check that the counter increases in one
    assert.strictEqual(prevCounter.body.length, afterCounter.body.length -1)
    // Check that the created item has the correct values
    assert.strictEqual(afterCounter.body.slice(-1)[0].likes, likesGenerator)
})

after(async () => {
    await mongoose.connection.close()
})