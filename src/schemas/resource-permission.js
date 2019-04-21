module.exports = {
    "id": "ResourcePermission",
    "properties": {
        "resource": {
            "type": "object",
            "description": "Url of the resource to be configured",
            "$ref": "Resource"
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