const BaseController = require('./baseController');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const { UPLOADOPERATIONS } = require('../lib/constants')

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
});

class Uploads extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    // saving medias to aws s3
    // rules ::
    // 1. Only signedin user can upload any media type 
    // 2. Tie uploaded media to the collection that's being created
    // 3. check extension for sent media type... e.g Image{'.png, .jpg, .gif'}, Videos { '.mp4, .mov, '.'}
    // 4. req must include options type e.g VIDEO,AUDIO,USERPROFILE,IMAGE
    async index(req, res, next) {
        const { operation_type, file_extension } = req.body;
        
        if(!operation_type && !file_extension) return next(this.transformResponse(res, false, 'InvalidContent', 'Missing json content'))
        const acceptedFileExtensions = /\.(jpg|jpeg|png|mp4|mov|mp3)$/i
        file_extension = file_extension.trim().toLowerCase()
        if(!acceptedFileExtensions.test(file_extension)){
            return next(this.transformResponse(res, false, 'BadRequest', 'Invalid file'))
        }
        // This is for the purpose of folder management on the storage platform
        const operation = operation_type.trim().toUpperCase();
        let key;
        switch(operation){
            case UPLOADOPERATIONS.AUDIO:
                key = `${req.user.id}/${UPLOADOPERATIONS.AUDIO}/${uuid()}.${file_extension}`
            break;
            case UPLOADOPERATIONS.VIDEO:
                key = `${req.user.id}/${UPLOADOPERATIONS.VIDEO}/${uuid()}.${file_extension}`
            break;
            case UPLOADOPERATIONS.IMAGE:
                key = `${req.user.id}/${UPLOADOPERATIONS.IMAGE}/${uuid()}.${file_extension}`
            break;
            default:
                next(this.transformResponse(res, false, 'BadRequest', 'Unknown operation'))
            break;
        }
        // handle request with params
        s3.getSignedUrl('putObject', {
            Bucket: keys.Bucket,
            ContentType: `${operation}/${file_extension}`,
            Key: key,
            ExpiresIn: 120,
        }, (err, url) => {
            if(err) return next(this.transformResponse(res, false, 'InternalServerError', err.message));
            return this.transformResponse(res, true, { key, url }, 'Request was successful');
        })
    }
}

module.exports = Uploads