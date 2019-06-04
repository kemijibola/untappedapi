const mongoose = require('mongoose');
const BaseController = require('./baseController');
class Resources extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const resources = await this.lib.db.model('Resource').find();
        const halObj = this.writeHAL(resources);
        return this.transformResponse(res, true, halObj, 'Fetch operation successful');
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                // TODO: validating client's parameters
                // type cast string id to mongoose ObjectId
                let permissions = body.permissions.reduce((acc, item) => {
                    acc[item] = mongoose.Types.ObjectId(item);
                    return acc
                }, {})
                body.permissions = [...Object.keys(permissions)];
                // this is checking if the resource has been configured, if not, it creates the object ,otherwise,
                // it adds to the existing collection by merging existing permissions with incoming permissions
                // and saves to database
                let resourceModel = await this.lib.db.model('Resource').findOne({resource: body.name})
                if (!resourceModel){
                    resourceModel = this.lib.db.model('Resource')(body);
                }else {
                    resourceModel.permissions = this.lib.helpers.mergeLists(resourceModel.permissions, body.permissions)
                }
                const resource = await resourceModel.save()
                // if (resource && typeof resource.log === 'function'){
                //     const data = {
                //         action: `create-resource of ${resource._id}`, // should capture action id for tracking e.g permission._id
                //         category: 'resource',
                //         // createdBy: req.user.id,
                //         createdBy: 'test user',
                //         message: 'Created resource'
                //     }
                //     resource.log(data);
                // }
                const halObj = this.writeHAL(resource)
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else{
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = Resources