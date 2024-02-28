const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs)
})


blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (request.body.author === undefined || request.body.title === undefined) {
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