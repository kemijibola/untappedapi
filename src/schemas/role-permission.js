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
            "description": "List of permissions assigned to configured role",
            "$ref": "Permission"
        },
        "resource": {
            "type": "object",
            "description": "The url role is being configured on",
            "$ref": "Resource"
        }
    }
}