const logger = require('./logger')

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

module.exports = {
    requestLogger,
    tokenExtractor
}