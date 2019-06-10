module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "action": {
                   "type": 'string'
               },
               "files": {
                    "type": 'array'
                }
            },
            "required": ['action','files']
        }
    }
}