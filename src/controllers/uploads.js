const BaseController = require('./baseController');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const { ACCEPTED_MEDIA_TYPES, UPLOAD_ACTION } = require('../lib/constants')
const { UploadInvalidContent, UploadInvalidFile } = require('../lib/errors/upload');
const { InternalServerError } = require('../lib/errors/applicationError');

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
    // 2. check extension for sent media type... e.g Image{'.png, .jpg, .gif'}, Videos { '.mp4, .mov, '.'}
    async index(req, res, next) {
        const { action, files } = req.body;
        if(files.length < 1) {
            return next(new UploadInvalidContent('No media upload'));
        }
        // TODO:: we can restrict the number of media a user can upload based on their assigned role/priviledge
        // The type of operation is used to determine the the number of items user can upload
        // type of operaions includes option in contants.UPLOAD_OPERATION_TYPE

        try {
            // This is generating key for the medias sent
            const filesMap = files.reduce( (theMap, file) => {
                let [_, fileExtension] = file['file'].split('.')
                fileExtension = fileExtension.toLowerCase()
                // we are ensuring the user sent valid media type for processing on s3
                if(!ACCEPTED_MEDIA_TYPES[fileExtension]){
                    return next(new UploadInvalidFile('Invalid file'))
                }
                theMap[file['file']] = `${'8be9da14-6033-494a-908c-404b13558b15'}/${UPLOAD_ACTION[action]}/${ACCEPTED_MEDIA_TYPES[fileExtension]}/${uuid()}.${fileExtension}`
                return theMap;
            }, {});

            // Generating signed url from s3 for each image
            let signedUrls = {};
            console.log(filesMap);
            for (let item in filesMap){
                s3.getSignedUrl('putObject', {
                    Bucket: keys.Bucket,
                    ContentType: files[0]['file_type'],
                    Key: filesMap[item],
                    ExpiresIn: 120,
                }, (err, url) => {
                    if(err) {
                        console.log(err);
                        return next(new InternalServerError(`Internal server error. Please contact Untapped Pool's admin`));
                    }
                    signedUrls[key] = url
                })
            }
            return this.transformResponse(res, true, signedUrls, 'Operation successful');

        } catch(err){
            console.log(err.message)
            return next(new InternalServerError(`Internal server error. Please contact Untapped Pool's admin`))
        }
    }
}

module.exports = Uploads