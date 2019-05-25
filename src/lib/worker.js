var kue = require('kue');
var Queue = kue.createQueue();
var mailer = require('./mailer');
const lib = require('./');

Queue.process("send-instant", async function(job, done) {
    let { data } = job;
    let currentTime = new Date()
    let updateSchedule = {};
    try{
        // use id to fetch mail details
        // TODO: This should send batch
        let scheduleModel = await lib.db.model('ScheduledEmail').findById({
            _id: data.scheduleId, is_sent: false,
            ready_to_send: true, schedule_date: { $lte: currentTime },
            is_picked_for_sending: false
        });
        // send mail  
        if (scheduleModel)  {
            updateSchedule = {
                is_picked_for_sending: true
            }
            scheduleModel = Object.assign(scheduleModel, updateSchedule)
            await scheduleModel.save();
            
            const mailData = {
                cc_copy_email: scheduleModel.cc_copy_email,
                subject: scheduleModel.subject,
                receiver_email: scheduleModel.receiver_email,
                sender_email: scheduleModel.sender_email,
                body: scheduleModel.body
            }
            // send mail object to mailer
            const mail = await mailer.send(mailData)

            // update schedule-email properties
            updateSchedule = {
                is_sent: mail.isSent,
                sent_date: new Date(),
                error_message: mail.errorMessage
            };
            scheduleModel = Object.assign(scheduleModel, updateSchedule);
            await scheduleModel.save();
            done();
        }
    }catch(err){
        // log error into db with job.scheduleId

    }
});

Queue.process("send-recurrent", async function(job, done) {
    let { data } = job;
    // use id to fetch mail details

    // send mail
    await mailer.send(data);
    done();
});

