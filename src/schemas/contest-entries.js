module.exports = {
    "id": "ContestEntry",
    "properties": {
        "contestant": {
            "type": "object",
            "description": "The owner of the entry",
            "$ref": "User"
        },
        "contest": {
            "type": "object",
            "description": "The contest the user is submitting entry for",
            "$ref": "Contest"
        },
        "entry": {
            "type": "string",
            "description": "The entry the user is submitting" 
        },
        "date": {
            "type": "date",
            "description": "The date the entry was submitted"
        }
    }
}