require('dotenv').config()

const PORT = process.env.PORT
let MONGOURL = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI

module.exports = {
    MONGOURL,
    PORT
}