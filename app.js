const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blog')

mongoose.connect(config.MONGOURL)
  .then(() => console.log('Conneceted to MongoDB'))
  .catch(error => console.error('Error connecting: ', error.message))

app.use(cors())
app.use(express.json())
app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app