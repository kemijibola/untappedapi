module.exports = {
    "id": "Collection",
    "properties": {
        "title": {
            "type": "string",
            "description": "Short album title",
        },
        "media_type": {
            "string": "string",
            "description": "Upload type. {'audio','video','image'}"
        },
        "album_cover": {
            "type": "string",
            "description": "Collection cover"
        },
        "upload_date": {
            "type": "string",
            "description": "Date the album was created"
        },
        "short_words": {
            "type": "string",
            "description": "Description of collection"
        },
        "user": {
            "type": "object",
            "description": "The collection owner",
            "$ref": "User"
        },
        "items": {
            "type": "array",
            "description": "List of items",
            "items": {
                "type": "object",
                "properties": {
                    "_id": {
                        "type": "ObjectId"
                    },
                    "path": {
                        "type": "Path of item"
                    },
                    "likes": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "user": {
                                    "type": "object",
                                    "$ref": "User"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}