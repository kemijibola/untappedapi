module.exports = {
    "id": "Appointment",
    "properties": {
        "receiver": {
            "type": "object",
            "description": "The user the invite is sent to",
            "$ref": "User"
        },
        "sender": {
            "type": "object",
            "description": "The user that is initiating the invite",
            "$ref": "User"
        },
        "appointment_date": {
            "type": "date",
            "description": "Appointment date and time"
        },
        "location": {
            "type": "object",
            "description": "Appointment location e.g Physical, skype,slack,Microsoft team",
            "properties": {
                "key": {
                    "type": "string"
                },
                "value": {
                    "type": "string"
                }
            }
        },
        "note": {
            "type": "string",
            "description": "Additional information regarding the appointment"
        },

    }
}