const keys = require('../config/settings');
const Queue = require('bee-queue');

const emailQueue = new Queue('email', {
    redis: {
      host: keys.redis_host,
      port: keys.redis_port
    },
    isWorker: false
});

emailQueue.process(function (job, done) {
    console.log(`Processing job ${job.id}`);
    return done(null, job);
});