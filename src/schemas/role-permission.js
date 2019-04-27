module.exports = {
    "id": "RolePermission",
    "properties": {
        "role": {
            "type": "object",
            "description": "Role",
            "$ref": "Role"
        },
        "permissions": {
            "type": "array",
            "description": "List of all permissions that can be performed by this this role",
            "items": {
                "$ref": "Permission"
            }
        },
        "resource": {
            "type": "object",
            "description": "Resource being configured for role",
            "$ref": "Resource"
        }
    }
}