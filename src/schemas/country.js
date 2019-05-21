module.exports = {
    "id": "Country",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of country"
        },
        "currencies": {
            "type": "array",
            "items": {
                "type": "string"
            }
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