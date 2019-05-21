module.exports = {
    "id": "Comment",
    "properties": {
        "collection": {
            "type": "object",
            "description": "Collection comment is created on",
            "$ref": "Collection"
        },
        "user": {
            "type": "object",
            "description": "The user that created comment",
            "$ref": "User"
        },
        "created_date": {
            "type": "date",
            "description": "Date comment was created"
        },
        "message": {
            "type": "string",
            "description": "Comment"
        },
        "replies": {
            "type": "array",
            "description": "Replies of comment",
            "items": {
                "type": "object",
                "properties": {
                    "user": {
                        "type": "string"
                    },
                    "date": {
                        "type": "date"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            }
        }
    }
}
