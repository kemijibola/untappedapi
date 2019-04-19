module.exports = {
    "id": "Profile",
    "properties": {
        "stage_name": {
            "type": "string",
            "description": "User's stage name"
        },
        "full_name": {
            "type": "object",
            "description": "User's full name",
            "$ref": "UserType"
        },
        "phone_numbers": {
            "type": "array",
            "description": "User's phone numbers",
            "items": {
                "type": "string"
            }
        },
        "user": {
            "type": "object",
            "description": "User that owns the profile",
            "$ref": "User"
        },
        "short_bio": {
            "type": "string",
            "description": "Brief description of User"
        },
        "categories": {
            "type": "array",
            "description": "User categories",
            "items": {
                "$ref": "Category"
            }
        },
        "social_media": {
            "type": "array",
            "description": "User's social media account",
            "items": {
                "type": "string"
            }
        },
        "images": {
            "type": "array",
            "description": "Profile and Banner pictures and other type of user picture",
            "items": {
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string"
                    },
                    "value": {
                        "type": "string"
                    }
                }
            }

        }
    }
}