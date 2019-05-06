module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "title": {
                    "type": 'string'
                },
                "information": {
                    "type": "string"
                },
                "banner": {
                    "type": "string"
                },
                "categories": {
                    "type": "array"
                },
                "start_date": {
                    "type": "date"
                },
                "duration": {
                    "type": "number"
                },
                "selection_type": {
                    "type": "mixed"
                },
                "redeemables": {
                    "type": "object"
                }
            },
            "required": ['title', 'information']
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