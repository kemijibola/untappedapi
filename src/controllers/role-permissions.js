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
                // TODO: validating client's parameters
                // type cast string id to mongoose ObjectId
                let permissions = body.permissions.reduce((acc, item) => {
                    acc[item] = mongoose.Types.ObjectId(item);
                    return acc
                }, {})
                body.permissions = [...Object.keys(permissions)];
                // this is checking if the resource has been configured for this role, if not, it creates the object ,otherwise,
                // it adds to the existing collection by merging existing permissions with incoming permissions
                // and saves to database
                let rolePermissionModel = await this.lib.db.model('RolePermission')
                    .findOne({
                        resource: body.resource,
                        role: body.role
                    })
                if (!rolePermissionModel){
                    rolePermissionModel = this.lib.db.model('RolePermission')(body);
                }else {
                    // rolePermissionModel.permissions = this.mergePermissions(resourcePermissionModel.permissions, body.permissions)
                    rolePermissionModel.permissions = this.lib.helpers.mergeLists(rolePermissionModel.permissions, body.permissions)
                }
                const rolePermission = await rolePermissionModel.save()
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
                const halObj = this.writeHAL(rolePermission)
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else{
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }

}

module.exports = RolePermissions
