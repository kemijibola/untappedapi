const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/settings')


const client = redis.createClient(keys.redis_host);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(audience = ''){
    this.useCache = true;
    this.domain = audience;
    return this;
}

mongoose.Query.prototype.exec = async function(){
    if (!this.useCache){
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    const cachedValue = await client.get(key);
    if (cachedValue){
        return JSON.parse(cachedValue);
    }
    const result = await exec.apply(this, arguments);
    if (this.mongooseCollection.name === 'tenants') {
        const key = `tenantConfig:${this.domain}`
        client.set(key, JSON.stringify(result));
    } else {
        client.set(key, JSON.stringify(result));
    }
    return result;

}