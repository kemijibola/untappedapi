module.exports = {
    "id": "ScheduledEmail",
    "properties": {
        "mail_type": {
            "type": "string",
            "description": "This is the type of email. Transactional or Marketing mail"
        },
        "subject": {
            "type": "string",
            "description": "The subject of email",
        },
        "body": {
            "type": "string",
            "description": "The body of email",
        },
        "receiver_email": {
            "type": "string",
            "description": "The receiver's email address"
        },
        "cc_copy_email": {
            "type": "array",
            "description": "The list of copied email addresses",
            "items": {
                "type": "string"
            }
        },
        "sender_email": {
            "type": "string",
            "description": "The sender's email address"
        },
        "date_created": {
            "type": "date",
            "description": "The date mail schedule was created"
        },
        "schedule_date": {
            "type": "date",
            "description": "The date mail is scheduled to be sent"
        },
        "ready_to_send": {
            "type": "boolean",
            "description": "This is used to check mail to be sent instantly"
        },
        "is_picked_for_sending": {
            "type": "boolean",
            "description": "This is used to track mail that is ready to be sent and has been picked for sending"
        },
        "is_sent": {
            "type": "boolean",
            "description": "This is set to true when email has been sent"
        },
        "sent_date": {
            "type": "date",
            "description": "This is the date mail was sent successfully"
        },
        "error_message": {
            "type": "string",
            "description": "In case of error, this is used to track error generated when sending mail"
        }
    }
}