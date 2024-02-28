require('dotenv').config()

const PORT = process.env.PORT
const MONGOURL = process.env.MONGODB_URI

module.exports = {
    MONGOURL,
    PORT
}