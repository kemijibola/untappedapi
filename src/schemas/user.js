module.exports = {
    "id": "User",
    "properties": {
        "email": {
            "type": "string",
            "unique": true,
            "description": "Email address of user."
        },
        "name": {
            "type": "string",
            "description": "The name of user"
        },
        "password": {
            "type": "string",
            "description": "Password of user.",
            // specifying length for bcrypt to avoid truncating created hash
            "maxLength": 120
        },
        "email_confirmed": {
            "type": "boolean",
            "default": false,
            "description": "User email confirmation status."
        },
        "phone_confimed": {
            "type": "boolean",
            "default": false,
            "description": " User phone number confirmation status."
        },
        "profile_completed": {
            "type": "boolean",
            "default": false,
            "description": "Profile completetion status."
        },
        "general_notification": {
            "type": "boolean",
            "default": true,
            "description": "User generation notification preference."
        },
        "email_notification": {
            "type": "boolean",
            "default": true,
            "description": "User email notification preference."
        },
        "profile_visibility": {
            "type": "boolean",
            "default": false,
            "description": "User profile visibility preference."
        },
        "login_count": {
            "type": "number",
            "default": 0,
            "description": "User login count."
        },
        "status": {
            "type": "array",
            "description": "User account status. Could be array of any type",
            "items": {
                "type": "mixed"
            }
        },
        "user_type": {
            "type": "string",
            "description": "Type of user"
        },
        "roles": {
            "type": "array",
            "description": "List of user roles",
            "items": {
                "$ref": "Role"
            }
        }
    }
}