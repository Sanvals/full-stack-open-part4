const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const middleware = require('../utils/middleware');

/*
const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const cleanToken = authorization.replace('Bearer ', '')
    return cleanToken
  }
  return null
}
*/

blogRouter.use(middleware.tokenExtractor)

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
  //grab the token
  console.log(request.token)
  if(!request.token) {
    return response.status(401).json({ error: 'token not found' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }

  //grab the person who bears the token
  const user = await User.findById(decodedToken.id)
  
  //create a new blog and assign the id
  const blog = new Blog(request.body)
  blog.author = user._id

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