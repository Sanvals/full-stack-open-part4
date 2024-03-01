const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .find({}).populate('author', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
    .find({}).populate('author', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  //grab the first person on the database
  const grabOne = await User.find({})
  console.log(grabOne)
  const grabOneId = grabOne[0].id
  
  //create a new blog and assign the id
  const blog = new Blog(request.body)
  blog.author = grabOneId

  console.log(blog)

  if (request.body.title === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const saveBlog = await blog.save()
  response.status(201).json(saveBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const blogs = await Blog.findByIdAndDelete(request.params.id)
  response.json(blogs)
})

blogRouter.put('/:id', async (request, response) => {
  const blogs = await Blog.findByIdAndUpdate(request.params.id, {...request.body}, { new: true })
  response.json(blogs)
})

module.exports = blogRouter