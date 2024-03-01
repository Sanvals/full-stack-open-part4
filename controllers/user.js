const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
  })

usersRouter.get('/:id', async (request, response) => {
  const users = await User.findById(request.params.id)
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // check if that username is already taken
  const userTaken = await User.find({ username: username })
  if (userTaken.length === 1) {
    return response.status(409).json("User already taken")
  }

  // check if the user and password are the desired length
  if (username.length <= 3 || password.length <= 3) {
    return response.status(400).json("Username and password must be longer than 3 characters")
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter