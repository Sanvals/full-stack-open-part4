const { test, after, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

before(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const newUser ={
        username: "root",
        name: "root",
        password: "rootPassword"
    }

    await api.post('/api/users')
        .send(newUser)
})

test('user can log in with correct credentials', async () => {
    const userLogin = {
        username: "root",
        password: "rootPassword"
    }

    const loginResponse = await api.post('/api/login')
        .send(userLogin)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    token = loginResponse.body.token
    assert(token)
})

test('on creating a blog if no token is provided, returns unauthorized', async () => {
    const newBlog = {
        "title": `first database document`
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)
})

test('first creates 2 blog posts', async () => {
    const newBlogOne = {
        "title": "blog test 1"
    }

    const newBlogTwo = {
        "title": "blog test 2"
    }

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogOne)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    // console.log('created first blog')

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogTwo)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // console.log('created second blog')
    
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

    if (response.length > 0) {
        return assert.strictEqual("id" in response[0], true)
    } else {
        assert.strictEqual("id" in response.body[0], true)
    }
})

test('creates new blog via POST and checks the count', async () => {
    const prevCounter = await api.get('/api/blogs')
    const likesGenerator = Math.round(Math.random() * 100)
    
    const newBlog =
        {
            "title": "The Things 3",
            "url": "http://www.google.es",
            "likes": likesGenerator
        }

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        "url": "http://www.google.es",
    }

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body.slice(-1)[0].likes, 0)
})

test('if no title is submitted, it throws 400', async () => {
    const newBlog =
    {
        "url": "http://www.google.es"
    }

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('it deletes a post correctly', async () => {
    const newBlog =
    {
        "title": "post to be deleted",
        "url": "http://www.google.es",
    }

    await api.post('/api/blogs').send(newBlog)
    
    // Fetch the ID of the last sent blog post
    const postToDelete = await api.get('/api/blogs')
    const idOfPost = postToDelete.body.slice(-1)[0].id
    // Delete the created post
    await api.delete(`/api/blogs/${idOfPost}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('it updates a post correctly', async () => {
    const blog =
    {
        "title": "Post to be updated",
        "url": "http://www.google.es",
        "likes": 2
    }
    // create a new post
    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    // catches the post created
    const newPost = await api.get('/api/blogs')
    const dataNewPost = newPost.body.slice(-1)[0]

    // Check if it has the correct amount of likes
    assert.strictEqual(dataNewPost.likes === 2, true)
    
    // update the likes to 100
    const newLikes = {
        "likes": 100
    }
    await api.put(`/api/blogs/${dataNewPost.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newLikes)
        .expect(200)

    // get the updated post
    const updatedPost = await api.get(`/api/blogs/${dataNewPost.id}`)

    // compare the likes to 100
    assert.strictEqual(updatedPost.body[0].likes, 100)
})

test('it deletes all posts correctly', async () => {
    // delete all posts on the database
    await Blog.deleteMany()

    // Fetch the ID of the last sent blog post
    const checkEmpty = await api.get('/api/blogs')
    
    // Check that there are 0 posts on the blog
    assert.strictEqual(checkEmpty.body.length, 0)
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})

