module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "full_name": {
                    "type": 'string'
                },
                "user": {
                    "type": "string"
                },
                "location": {
                    "type": "string"
                },
                "categories": {
                    "type": "array"
                }
            },
            "required": ['user', 'full_name', 'location', 'categories']
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