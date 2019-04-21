module.exports = {
    "id": "RolePermission",
    "properties": {
        "role": {
            "type": "object",
            "description": "Role",
            "$ref": "Role"
        },
        "resource_permission": {
            "type": "object",
            "description": "Resource permission configured",
            "$ref": "ResourcePermission"
        }
    }
}