module.exports = {
    "id": "ContestPoint",
    "properties": {
        "entry": {
            "type": "object",
            "description": "The entry to be voted",
            "$ref": "ContestEntry"
        },
        "vote_channel": {
            "type": "string",
            "description": "The channel the vote was cast. e.g ONLINE,SMS, PAYSTACK"
        },
        "point": {
            "type": "number",
            "description": "The number of points allocated" 
        },
        "user": {
            "type": "string",
            "description": "The user that voted for entry.E.g "
        }
    }
}