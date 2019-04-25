const BaseController = require('./baseController');
const mongoose = require('mongoose');
class RolePermissions extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const rolePermissions = await this.lib.db.model('RolePermission').find();
        this.writeHAL(res, rolePermissions);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                let criteria = {};
                // TODO: validate role is a valid role
                // validate resource_permission is valid

                // check :: a role can be configured for a route
                criteria.$and = [
                    { role: body.role },
                    { resourcePermission: body.resourcePermission }
                ]
                let rolePermissionModel = await this.lib.db.model('RolePermission').findOne(criteria)
                if(rolePermissionModel) return next(this.transformResponse(res, false, 'DuplicateRecord', `Role id: ${rolePermissionModel.role} has been configured for route: ${rolePermissionModel.resourcePermission}.`))
                rolePermissionModel = this.lib.db.model('RolePermission')(body);
                const rolePermission = await rolePermissionModel.save();
                // if (rolePermission && typeof rolePermission.log === 'function'){
                //     const data = {
                //         action: `create-role-permission of ${rolePermission._id}`, // should capture action id for tracking e.g permission._id
                //         category: 'role-permissions',
                //         // createdBy: req.user.id,
                //         createdBy: 'test user',
                //         message: 'Created role-permission'
                //     }
                //     rolePermission.log(data);
                // }
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

module.exports = RolePermissions