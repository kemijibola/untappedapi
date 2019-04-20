const BaseController = require('./baseController');
class ResourcePermissions extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const resourcePermissions = await this.lib.db.model('ResourcePermission').find().cache();
        this.writeHAL(res, resourcePermissions);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const resourcePermissionExist = await this.lib.db.model('ResourcePermission').findOne({name: body.name});
                if(resourcePermissionExist) return next(this.transformResponse(res, false, 'DuplicateRecord', `Resource-Permission with name ${rolePermissionExist.name} exists.`))
                let newResourcePermission = this.lib.db.model('ResourcePermission')(body);
                const resourcePermission = await newResourcePermission.save();
                if (resourcePermission && typeof resourcePermission.log === 'function'){
                    const data = {
                        action: `create-resource-permission of ${resourcePermission._id}`, // should capture action id for tracking e.g permission._id
                        category: 'resource-permissions',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created resource-permission'
                    }
                    resourcePermission.log(data);
                }
                const halObj = this.writeHAL(resourcePermission)
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = ResourcePermissions