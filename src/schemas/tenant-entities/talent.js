module.exports = {
    "id": "Talent",
    "definitions": {
        "physical_attributes": {
          "type": "object",
          "properties": {
            "height": { "type": "string" },
            "body_type": { "type": "string" },
            "color": { "type": "string" }
          }
        //   "required": ["street_address", "city", "state"]
        }
      },    
    "properties": {
        "stage_name": {
            "type": "string",
            "description": "User's stage name"
        },
        "full_name": {
            "type": "string",
            "description": "User's full name"
        },
        "location": {
            "type": "string",
            "description": "User's location"
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
        "profile_picture": {
            "type": "string",
            "description": "User profile picture",
        },
        // "physical_stats": {
        //     "description": "Users's physical attributes",
        //     "$ref": "#definitions/physical_attributes"
        // },
        "experiences": {
            "type": "array",
            "description": "List of user's experience",
            "items": {
                "type": "object",
                "properties": {
                    "activity_name": {
                        "type": "string"
                    },
                    "more_info": {
                        "type": "string"
                    }
                }
            }
        }
    }
}