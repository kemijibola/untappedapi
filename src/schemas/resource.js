module.exports = {
    "id": "Resource",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of service e.g /users"
        },
        "permissions": {
            "type": "array",
            "description": "List of all permissions that can be performed on a resource",
            "items": {
                "$ref": "Permission"
            }
        }
    }
}