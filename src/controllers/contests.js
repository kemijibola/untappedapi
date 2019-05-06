const BaseController = require('./baseController');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const { ACCEPTED_MEDIA_TYPES } = require('../lib/constants')

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
});

class Contests extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }
    // saving medias to aws s3
    // rules ::
    // 1. Only signedin user can upload any media type 
    // 2. check extension for sent media type... e.g Image{'.png, .jpg, .gif'}, Videos { '.mp4, .mov, '.'}
    async index(req, res, next) {
        const { operation, medias } = req.body;
        if(!medias) return next(this.transformResponse(res, false, 'InvalidContent', 'Missing json content'))
        //const acceptedFileExtensions = /\.(jpg|jpeg|png|mp4|mov|mp3)$/i

        // TODO:: we can restrict the number of media a user can upload based on their assigned role/priviledge
        // The type of operation is used to determine the the number of items user can upload
        // type of operaions includes option in contants.UPLOAD_OPERATION_TYPE

        try {
        // This is generating key for the medias sent
        const mediasMap = medias.reduce( (theMap, media) => {
            const [rawFilename, fileExtension] = media.split('.')
            theMap[media] = `${req.user.sub}/${ACCEPTED_MEDIA_TYPES[fileExtension]}/${uuid()}.${fileExtension}`
            return theMap;
        }, {});

        // we are ensuring the user sent valid media type for processing on s3
        for (let item in mediasMap) {
            const [file, extention] = item.split('.');
            if(!ACCEPTED_MEDIA_TYPES[extention]){
                return next(this.transformResponse(res, false, 'InvalidContent', 'Invalid file.'))
            }
        }
        // Generating signed url from s3
        let signedUrls = {};
        for (let item in mediasMap){
            s3.getSignedUrl('putObject', {
                Bucket: keys.Bucket,
                ContentType,
                Key: mediasMap[item],
                ExpiresIn: 120,
            }, (err, url) => {
                if(err) return next(this.transformResponse(res, false, 'InternalServerError', err.message));
                signedUrls = {
                    key: item,
                    url: url
                }
            })
        }
        return this.transformResponse(res, true, signedUrls, 'data');

        }catch(err){
            if(err) return next(this.transformResponse(res, false, 'InternalServerError', err.message));
        }
    }
}

module.exports = Contests