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
            "description": "Social media associated with user",
            "items": {
                "type": "string"
            }
        },
        "image_variations": {
            "type": "array",
            "description": "User's profile images in different variation",
            "items": {
                "type": "object",
                "properties": {
                    "img_size": {
                        "type": "string"
                    },
                    "img_path": {
                        "type": "string"
                    }
                }
            }
        }
    }
}