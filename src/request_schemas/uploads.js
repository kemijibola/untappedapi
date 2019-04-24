module.exports = {
    "POST": {
        "validate": 'body',
        "schema": {
            "type": "object",
            "properties": {
               "medias": {
                    "type": 'array'
                }
            },
            "required": ['medias']
        }
    }
}