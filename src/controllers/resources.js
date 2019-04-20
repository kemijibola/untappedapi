const BaseController = require('./baseController');
class Resources extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const resources = this.lib.db.model('Resource').find();
        this.writeHAL(res, resources);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const resourceExist = await this.lib.db.model('Resource').findOne({ name: body.name });
                if(roleExist) return next(this.transformResponse(res, false, 'DuplicateRecord', `Resource with name ${ resourceExist.name } exists.`))
                let newResource = this.lib.db.model('Resource')(body);
                const resource = await newResource.save();
                if (resource && typeof resource.log === 'function'){
                    const data = {
                        action: `create-resource of ${resource._id}`, // should capture action id for tracking e.g userType._id
                        category: 'resource',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created resource'
                    }
                    resource.log(data);
                }
                const halObj = this.writeHAL(resource);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = Resources