const {createClient} = require('redis')
const dotenv = require('dotenv')
dotenv.config();

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12358
    }
});

module.exports = redisClient



