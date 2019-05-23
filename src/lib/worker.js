var kue = require('kue');
var Queue = kue.createQueue();
var mailer = require('./mailer');
const lib = require('./');

Queue.process("send-instant", async function(job, done) {
    let { data } = job;
    // use id to fetch mail details
    const scheduleData = await lib.db.model('ScheduledEmail').findById({_id: data.scheduleId});
    // send mail
    await mailer.send(scheduleData);
    done();
});

Queue.process("send-recurrent", async function(job, done) {
    let { data } = job;
    // use id to fetch mail details

    // send mail
    await mailer.send(data);
    done();
});