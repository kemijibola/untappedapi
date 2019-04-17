module.exports = {
    "id": "ApplicationPermission",
    "properties": {
        "application_id": {
            "type": "string",
            "description": "The microservice that is being configured"
        },
        "permissions": {
            "type": "array",
            "description": "List of all actions that can be performed on the microservice",
            "items": {
                "$ref": "Permission"
            }
        }
    }
}