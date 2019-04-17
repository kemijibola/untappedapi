const BaseController = require('./baseController');
const { UPLOADOPTIONS } = require('../lib/constants');

class Collections extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const collections = await this.lib.db.model('Collection').find().cache();
        this.writeHAL(res, collections);
    }

    async create(req, res, next){
        const body = req.body;
        let criteria;
        if(body){
            try{
                const title = body.title.trim();
                const media_type = body.media_type.trim();
                criteria.$and = [        
                    {title: title},        
                    {media_type: media_type}  
                ];
                const collectionExist = await this.lib.db.model('Collection').findOne(criteria);
                if(collectionExist) return next(this.Error(res, 'DuplicateRecord', `${media_type} Album with title ${collection.name} exists.`))
                let newCollection = this.lib.db.model('Collection')(body);
                const collection = await newCollection.save();
                const halObj = this.writeHAL(response);
                return this.transformResponse(res, true, halObj, 'Create operation successful');

            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'))
        }
    }
}

module.exports = function(lib){
    let controller = new Collections(lib);
    controller.addAction({
        'path': '/collections',
        'method': 'POST',
        'summary': 'Adds a new collection to the database',
        'responseClass': 'Collection',
        'nickName': 'addCollection',
    }, controller.create)

    return controller;
}