const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('first creates 2 blog posts', async () => {
    const newBlog = {
        "author": "pepe",
        "title": `first database document`
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const checkIfTwo = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(checkIfTwo.body.length, 2)
})

test('2 blog posts are returned as json', async () => {
  const blogs = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(blogs.body.length, 2)
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

test('creates new blog via POST and checks the count', async () => {
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

test('if no likes were saved, it defaults to 0', async () => {
    const newBlog =
    {
        "title": "without 0",
        "author": "pepe",
        "url": "http://www.google.es",
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body.slice(-1)[0].likes, 0)
})

test('if no title is submitted, it throws 400', async () => {
    const newBlog =
    {
        "author": "pepe",
        "url": "http://www.google.es"
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('if no author is submitted, it throws 400', async () => {
    const newBlog =
    {
        "title": "The things",
        "url": "http://www.google.es"
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('it deletes a post correctly', async () => {
    const newBlog =
    {
        "title": "post to be deleted",
        "author": "pepe",
        "url": "http://www.google.es",
    }

    await api.post('/api/blogs').send(newBlog)
    
    // Fetch the ID of the last sent blog post
    const postToDelete = await api.get('/api/blogs')
    const idOfPost = postToDelete.body.slice(-1)[0].id
    // Delete the created post
    await api.delete(`/api/blogs/${idOfPost}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('it updates a post correctly', async () => {
    const blog =
    {
        "title": "Post to be updated",
        "author": "System",
        "url": "http://www.google.es",
        "likes": 2
    }
    // create a new post
    await api.post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // catches the post created
    const newPost = await api.get('/api/blogs')
    const dataNewPost = newPost.body.slice(-1)[0]
    // Check it has the correct amount of likes
    assert.strictEqual(dataNewPost.likes === 2, true)

    // update the likes to 100
    const newLikes = {
        "likes": 100
    }
    await api.put(`/api/blogs/${dataNewPost.id}`)
        .send(newLikes)
        .expect(200)

    // get the updated post
    const updatedPost = await api.get(`/api/blogs/${dataNewPost.id}`)
    // compare the likes to 100
    assert.strictEqual(updatedPost.body.likes, 100)
})

test('it deletes all posts correctly', async () => {
    // delete all posts on the database
    await Blog.deleteMany()
    
    // Fetch the ID of the last sent blog post
    const checkEmpty = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    // Check that there are 0 posts on the blog
    assert.strictEqual(checkEmpty.body.length, 0)
})


after(async () => {
await mongoose.connection.close()
})
