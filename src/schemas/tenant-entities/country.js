module.exports = {
    "id": "Country",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of country"
        },
        "states": {
            "type": "array",
            "description": "The List of states of a country",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            }
        }
    }
}