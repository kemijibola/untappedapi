module.exports = {
    "id": "Contest",
    "definitions": {
        "schemaArray": {
            "type": "array",
            "minItems": 1,
            "items": { "$ref": "#" }
        }
    },
    "properties": {
        "title": {
            "type": "string",
            "description": ""
        },
        "information": {
            "type": "string",
            "description": ""
        },
        "banner": {
            "type": "string",
            "description": ""
        },
        "categories": {
            "type": "array",
            "description": "",
            "items": {
                "$ref": "Category"
            }
        },
        "eligibility": {
            "type": "string",
            "description":" "
        },
        "submission_rule": {
            "type": "string",
            "description": ""
        },
        "start_date": {
            "type": "date",
            "description": ""
        },
        "duration": {
            "type": "number",
            "description": ""
        },
        "redeemables": {
            "type": "object",
            "$ref": "PrizeType",
            "prizes": {
                "type": "array",
                "items": "object",
                "properties": {
                    "key": {
                        "type": "string"
                    },
                    "value": {
                        "type": "string"
                    }
                }
            }
        },
        "status": {
            "type": "string",
            "description": "Status of the contest. e.g Created,Paid,Completed"
        }
    }
}