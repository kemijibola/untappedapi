module.exports = {
    "id": "Professional",
    "properties": {
        "company_name": {
            "type": "string",
            "description": "User's stage name"
        },
        "full_name": {
            "type": "string",
            "description": "User's full name",
            "$ref": "UserType"
        },
        "official_address": {
            "type": "string",
            "description": "User's official_address"
        },
        "rc_number": {
            "type": "string",
            "description": "Professional's corporate identity"
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
            "description": "User's interests",
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
        "profile_picture": {
            "type": "string",
            "description": "User profile picture",
        },
        "banner_image": {
            "type": "string",
            "description": "User's banner image"
        }
    }
}