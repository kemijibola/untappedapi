module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "name": {
                    "type": 'string'
                },
                "domain_name": {
                    "type": "string"
                },
                "database_host": {
                    "type": "string"
                },
                "database_name": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "office_address": {
                    "type": "string"
                },
                "payment_channels": {
                    "type": "array"
                },
                "application_settings": {
                    "type": "array"
                }
            },
            "required": ['name', 'domain_name','database_host','database_name','country','office_address','payment_channels','application_settings']
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