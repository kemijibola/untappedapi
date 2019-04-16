module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "email": {
                    "type": 'string',
                    "format": 'email'
                },
                "password": {
                    "type": 'string'
                },
                "user_type_id": {
                    "type": 'string'
                },
                "audience": {
                    "type": "string"
                }
            },
            "required": ['email', 'password', 'user_type_id', 'audience']
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