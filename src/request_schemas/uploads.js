module.exports = {
    "GET": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "operation_type": {
                    "type": 'string'
                },
                "file_extension": {
                    "type": "string"
                }
            },
            "required": ['operation_type', 'file_extension']
        }
    }
}