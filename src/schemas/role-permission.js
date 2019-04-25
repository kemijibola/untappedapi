module.exports = {
    "id": "RolePermission",
    "properties": {
        "role": {
            "type": "object",
            "description": "Role",
            "$ref": "Role"
        },
        "resourcePermission": {
            "type": "object",
            "description": "Resource permission configured",
            "$ref": "ResourcePermission"
        }
    }
}