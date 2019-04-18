const BaseController = require('./baseController');
class RolePermissions extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const rolePermissions = await this.lib.db.model('RolePermission').find().cache();
        this.writeHAL(res, rolePermissions);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const rolePermissionExist = await this.lib.db.model('RolePermission').findOne({name: body.name});
                if(rolePermissionExist) return next(this.transformResponse(res, false, 'DuplicateRecord', `Role-Permission with name ${rolePermissionExist.name} exists.`))
                let newRolePermission = this.lib.db.model('RolePermission')(body);
                const rolePermission = await newRolePermission.save();
                if (rolePermission && typeof rolePermission.log === 'function'){
                    const data = {
                        action: `create-role-permission of ${rolePermission._id}`, // should capture action id for tracking e.g permission._id
                        category: 'role-permissions',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created role-permission'
                    }
                    rolePermission.log(data);
                }
                const halObj = this.writeHAL(rolePermission);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new RolePermissions(lib);
    controller.addAction({
        'path': '/role-permissions',
        'method': 'POST',
        'summary': 'Adds a new role-permission to the database',
        'responseClass': 'RolePermission',
        'nickName': 'addRolePermission',
    }, controller.create)

    return controller;
}