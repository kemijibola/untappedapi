module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "name": {
                    "type": 'string'
                },
                "user_type": {
                    "type": "string"
                },
                "role_type": {
                    "type": "string"
                }
            },
            "required": ['name', 'user_type', "role_type"]
        }
    },
    "PUT": {
        "validate": 'params',
        "schema": {
            "type": "object",
            "properties": {
               "id": {
                    "type": 'string'
                }
            },
            "required": ['id']
        }
    },
    "DELETE": {
        "validate": 'params',
        "schema": {
            "type": "object",
            "properties": {
               "id": {
                    "type": 'string'
                }
            },
            "required": ['id']
        }
    }
}