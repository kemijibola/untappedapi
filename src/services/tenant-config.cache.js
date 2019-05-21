const redis = require('redis');
const util = require('util');
const keys = require('../config/settings')

const client = redis.createClient(keys.redis_port);
client.get = util.promisify(client.get);

module.exports = {
    getCachedData: getCachedData
}

async function getCachedData(key) {
    return await client.get(key);
}
