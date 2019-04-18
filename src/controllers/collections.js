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
    async lists(req, res, next){
        // all collections in db
        let criteria = {};
        if(req.params.q){
            let expr = new RegExp('.*' + req.params.q + '.*')
            criteria.$or = [
                {title: expr},
                {short_words: expr}
            ]
        }
        if(req.params.from_date){
            criteria.upload_date = { $gte: req.params.from_date}
        }
        if(req.params.to_date){
            criteria.upload_date = {$lte: req.params.to_date}
        }
        if(req.params.media_type){
            criteria.media_type = req.params.media_type   
        }
        // this will fetch collections by talent, if talent_id params is sent
        if(req.params.talent_id){
            criteria.user = req.params.talent_id
        }
        const collections = await this.lib.db.model('Collection')
            .find(criteria)
            .populate('user')
            .populate({path:'comments.user',model:'user'})
            .populate({path: 'replies.user', model: 'user'})
            .exec().cache();

        const halObj = this.writeHAL(collections);
        return this.transformResponse(res, true, halObj, 'Find operation successful'); 
    }
    async details(){
        // find one collection by id
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

                // saving medias to aws s3
                // rules ::
                // 1. Only signedin user can upload any media type 
                // 2. Tie uploaded media to the collection that's being created
                // 3. check extension for sent media type... e.g Image{'.png, .jpg, .gif'}, Videos { '.mp4, .mov, '.'}

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

    // app requests presigned url for client
    async getSignedUrl(){
        
    }
    async update(req, res, next){
        const body = req.body;
        const id = req.params.id.trim();
        if(body && id){
            try{
                // check if collection with id exists
                let collection = await this.lib.db.model('Collection').findOne({_id: id});
                if(!collection) return next(this.transformResponse(res, false, 'ResourceNotFoundError', 'Collection not found'))
                collection = Object.assign(collection, body)
                const updateObj = await collection.save();
                const halObj = this.writeHAL(updateObj.toJSON());
                return this.transformResponse(res, true, halObj, 'Update operation successful');
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

    controller.addAction({
        'path': '/collections/:id',
        'method': 'PUT',
        'summary': 'Updates already existing collection in database',
        'responseClass': 'Collection',
        'nickName': 'updateCollection',
    }, controller.update)

    return controller;
}