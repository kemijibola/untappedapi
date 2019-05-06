module.exports = {
    "id": "Contest",
    "properties": {
        "title": {
            "type": "string",
            "description": "Contest title"
        },
        "created_by": {
            "type": "object",
            "description": "The user that created the contest",
            "$ref": "User"
        },
        "information": {
            "type": "string",
            "description": "Contest additional information"
        },
        "banner": {
            "type": "string",
            "description": "Contest banner"
        },
        "categories": {
            "type": "array",
            "description": "Eligible category",
            "items": {
                "$ref": "Category"
            }
        },
        "eligibility": {
            "type": "string",
            "description":"Additional eligibility information"
        },
        "submission_rule": {
            "type": "string",
            "description": "Contest submission rule, if applicable"
        },
        "start_date": {
            "type": "date",
            "description": "Contest start date"
        },
        "duration": {
            "type": "number",
            "description": "Number of days the contest will run for"
        },
        "selection_type": {
            "type": "mixed",
            "description": "Contest final selection type. i.e Online / Online & Offline. Using mixed to save additional properties for Online & offline selection"
        },
        "evaluators": {
            "type": "array",
            "description": "The list of judges",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "email": {
                        "type": "string"
                    },
                    "profile": {
                        "type": "string"
                    },
                    "social": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "professions": {
                        "type": "array",
                        "items": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "experience_years": {
                                "type": "number"
                            }
                        }
                    }
                }
            }

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
            "description": "Status of the contest. e.g Started, Active, Completed"
        }
    }
}