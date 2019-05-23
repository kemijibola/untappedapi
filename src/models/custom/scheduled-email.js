class ScheduledEmail {
    constructor(id= '', mail_type = '',subject= '', body='', receiver_email='', cc_copy_email= [],
        sender_email= '', date_created= new Date(), schedule_date= new Date(),ready_to_send= false, 
        is_picked_for_sending= false, is_sent= false, sent_date,error_message= '') {
        this.id = id;
        this.mail_type = mail_type;
        this.subject = subject;
        this.body = body;
        this.receiver_email = receiver_email;
        this.cc_copy_email = cc_copy_email;
        this.sender_email = sender_email;
        this.date_created = date_created;
        this.schedule_date = schedule_date;
        this.ready_to_send = ready_to_send;
        this.is_picked_for_sending = is_picked_for_sending;
        this.is_sent = is_sent;
        this.sent_date = sent_date;
        this.error_message = error_message;
    }
}

module.exports = ScheduledEmail;