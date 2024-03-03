const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const middleware = require('../utils/middleware');

blogRouter.use(middleware.tokenExtractor)
blogRouter.use(middleware.userExtractor)

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
  if(!request.token) {
    return response.status(401).json({ error: 'token not found' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }

  //grab the person who bears the token
  // const user = await User.findById(decodedToken.id)
  
  //create a new blog and assign the id
  const blog = new Blog(request.body)
  
  // blog.author = user._id.toString()
  blog.author = request.userId

  if (request.body.title === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const saveBlog = await blog.save()
  response.status(201).json(saveBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  // check if the blog still exists
  const checkExistence = await Blog.find({ _id: request.params.id })
  if (checkExistence.length === 0) {
    return response.status(404).json({ error: 'blog not found' })
  }

  //compare it to the author of the blog to delete
  const blogToDelete = await Blog.findById(request.params.id)
  const ownerOfBlog = blogToDelete.author.toString()
  
  const userId = request.userId
  // console.log(`User ${userId} is the owner of blog ${ownerOfBlog}? ${userId === ownerOfBlog}`)

  if (userId === ownerOfBlog) {
    const blogs = await Blog.findByIdAndDelete(request.params.id)
    response.json(blogs)
  } else {
    response.status(401).json({ error: 'unauthorized' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  /*
  const blogs = await Blog.findByIdAndUpdate(request.params.id, {...request.body}, { new: true })
  response.json(blogs)
  */
  // check existence
  const checkExistence = await Blog.find({ _id: request.params.id })
  if (checkExistence.length === 0) {
    return response.status(404).json({ error: 'blog not found' })
  }
  // console.log("blog exists")

  // compare it to the author of the blog to modify
  const blogToModify = await Blog.findById(request.params.id)
  const ownerOfBlog = blogToModify.author.toString()
  // console.log(`User ${request.userId} is the owner of blog ${ownerOfBlog}? ${request.userId === ownerOfBlog}`)

  if (request.userId === ownerOfBlog) {
    const blogs = await Blog.findByIdAndUpdate(request.params.id, {...request.body}, { new: true })
    response.json(blogs)
  } else {
    response.status(401).json({ error: 'unauthorized' })
  }
})

module.exports = blogRouter