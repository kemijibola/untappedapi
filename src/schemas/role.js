module.exports = {
    "id": "Role",
    "properties": {
        "name": {
            "type": "string",
            "unique": true,
            "description": "Name of role"
        },
        "user_type": {
            "type": "object",
            "description": "Type of user",
            "$ref": "UserType"
        },
        "role_type": {
            "type": "string",
            "description": "Role types e.g ['Basic', 'Free', 'Gold', 'Premium']"
        }
    }
}