module.exports = {
    "id": "UserType",
    "properties": {
        "name": {
            "type": "string",
            "description": "Type of user"
        },
        "global": {
            "type": "boolean",
            "description": "Accessibility level of role. i.e: True: public, False: private"
        },
        "description": {
            "type": "string",
            "description": "Describes the type of user"
        },
    }
}