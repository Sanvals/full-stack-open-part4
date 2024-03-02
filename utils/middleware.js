const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const cleanToken = authorization.replace('Bearer ', '')
        request.token = cleanToken
    } else {
    request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) => {
    if (request.token) {
        const decodedToken = jwt.verify(request.token, config.SECRET)
        const user = await User.findById(decodedToken.id)
        request.userId = user._id.toString()
    }
    next()
}

module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor
}