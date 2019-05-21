module.exports = {
    "id": "Tenant",
    "properties": {
        "name": {
            "type": "string",
            "description": "Tenant name"
        },
        "domain_name": {
            "type": "string",
            "description": "Domain registered for tenant"
        },
        "database_host": {
            "type": "string",
            "description": "The database host for tenant"
        },
        "database_name": {
            "type": "string",
            "description": "The database name for tenant"
        },
        "country": {
            "type": "object",
            "description": "The country that created comment",
            "$ref": "Country"
        },
        "created_by": {
            "type": "object",
            "description": "The user that created tenant",
            "$ref": "User"
        },
        "approved_by": {
            "type": "object",
            "description": "The user that approved tenant",
            "$ref": "User"
        },
        "isActive": {
            "type": "boolean",
            "description": "This is used to activate/deactivate tenant"
        },
        "office_address": {
            "type": "string",
            "description": "The official address of the tenant"
        },
        "payment_channels": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "isVisible": {
                        "type": "boolean"
                    }
                }
            }
        },
        "application_settings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string"
                    },
                    "value": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    }
                }
            }
        },
        "date_created": {
            "type": "date",
            "description": "The date tenant was created"
        },
        "approved_date": {
            "type": "date",
            "description": "The date tenant creation was approved"
        }
    }
}