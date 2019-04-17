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
                if(resourcePermissionExist) return next(this.Error(res, 'DuplicateRecord', `Resource-Permission with name ${rolePermissionExist.name} exists.`))
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
                return this.writeHAL(res, rolePermission);
            }catch(err){
                next(this.Error(res, 'InternalServerError', err.message))
            }
        }else {
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new ResourcePermissions(lib);
    controller.addAction({
        'path': '/resource-permissions',
        'method': 'POST',
        'summary': 'Adds a new role-permission to the database',
        'responseClass': 'ResourcePermission',
        'nickName': 'addResourcePermission',
    }, controller.create)

    return controller;
}