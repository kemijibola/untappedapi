const keys = require('../config/settings')

const ERROR_CODES = {
    BadDigest: 400,
    BadMethod: 405,
    ConnectTimeout: 408,
    InternalServerError: 500,
    InvalidArgument: 409,
    ResourceNotFoundError: 404,
    InvalidContent: 400,
    BadRequest: 400,
    InvalidCredentials: 401,
    InvalidHeader: 400,
    InvalidVersion: 400,
    MissingParameter: 409,
    NotAuthorized: 403,
    RequestExpired: 400,
    RequestThrottled: 429,
    ResourceNotFound: 404,
    EntityNotFound: 404,
    WrongAccept: 406,
    DuplicateRecord: 400
}
const UNTAPPED_USER_TYPES = {
    TALENT: 'TALENT',
    AUDIENCE: 'AUDIENCE',
    PROFESSIONAL: 'PROFESSIONAL'
}

// const JWT_OPTIONS = {
//     ISSUER: 'http://127.0.0.1:9000',
//     EXPIRESIN: '12h',
//     CURRENTKEY: '42'
// }

const COLLECTION_UPLOAD_TYPE = {
    SINGLE: 'SINGLE',
    MULTIPLE: 'MULTIPLE'
}

const ACCEPTED_MEDIA_TYPES = {
    png: 'IMAGES',
    jpg: 'IMAGES',
    MP4: 'VIDEOS',
    MP3: 'AUDIOS'
}
const JWT_OPTIONS = {
    ISSUER: 'http://untappedpool.com',
    EXPIRESIN: '12h',
    ALG: keys.rsa_type,
    KEYID: keys.rsa_kid
}
const UPLOAD_OPERATION_TYPE = {
    GIGUPLOAD: 'GIGUPLOAD',
    PROFILEIMAGE: 'PROFILEIMAGE',
    PORTFOLIO: 'PORTFOLIO'
}

const ROLE_TYPES = {
    FREE: 'FREE',
    BASIC: 'BASIC',
    GOLD: 'GOLD',
    PREMIUM: 'PREMIUM'
}


module.exports = Object.assign({}, { 
    ERROR_CODES, 
    UNTAPPED_USER_TYPES, 
    JWT_OPTIONS, 
    COLLECTION_UPLOAD_TYPE, 
    ACCEPTED_MEDIA_TYPES, 
    ROLE_TYPES, 
    UPLOAD_OPERATION_TYPE
 })