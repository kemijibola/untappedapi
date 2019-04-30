module.exports = {
    "id": "Appointment",
    "definitions": {
        "appointment_location": {
            "type": "object",
            "properties": {
              "key": { "type": "string" },
              "value": { "type": "string" },
            },
            "required": ["key", "value"]
          }
    },
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
            "$ref": "#definitions/appointment_location",
            "description": "The Location of the appointment i.e Physical, Online",
        },
        "schedule_histories": {
            "type": "array",
            "description": "The list of reschedules made on appointment",
            "items": {
                "type": "object",
                "properties": {
                    "new_date": {
                        "type": "date"
                    },
                    "note": {
                        "type": "string"
                    }
                }
            }
        },
        "note": {
            "type": "string",
            "description": "Additional information regarding the appointment"
        },
        "status": {
            "type": "string",
            "description": "The status of the appointment i.e CONFIRMED, CANCELLED"
        }

    }
}