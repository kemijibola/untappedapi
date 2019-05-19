module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                },
               "email": {
                    "type": 'string',
                    "format": 'email'
                },
                "password": {
                    "type": 'string'
                },
                "user_type": {
                    "type": 'string'
                },
                "audience": {
                    "type": "string"
                }
            },
            "required": ['name', 'email', 'password', 'user_type', 'audience']
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