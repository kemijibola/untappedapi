module.exports = {
    "id": "Gig",
    "properties": {
        "sender": {
            "type": "object",
            "description": "The user sending the gig(s)",
            "$ref": "User"
        },
        "reciever": {
            "type": "object",
            "description": "The user recieving the gig(s)",
            "$ref": "User"
        },
        "note": {
            "type": "string",
            "description": "Short message for recipient"
        },
        "sent_date": {
            "type": "date",
            "description": "The date gig was created"
        },
        "items": {
            "type": "array",
            "description": "The collection of medias sent",
            "items": {
                "type": "string"
            }
        },
        "sender_deleted": {
            "type": "boolean",
            "description": "This is set to true if the sender has deleted a gig",
            "default": false
        },
        "reciever_deleted": {
            "type": "boolean",
            "description": "This is set to true if the reciever has deleted a gig",
            "default": false
        }
    }
}