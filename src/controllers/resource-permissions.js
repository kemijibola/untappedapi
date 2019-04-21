const BaseController = require('./baseController');
const mongoose = require('mongoose');
class ResourcePermissions extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const resourcePermissions = await this.lib.db.model('ResourcePermission').find().cache();
        this.writeHAL(res, resourcePermissions);
    }

    mergePermissions(list1, list2){
        let permissionMap1 = list1.reduce((theMap, theItem) => {
            if(theItem) theMap[theItem] = theItem
            return theMap;
        },{})
        let permissionMap2 = list2.reduce((theMap, theItem) => {
            if(theItem) theMap[theItem] = theItem
            return theMap;
        },{})

        let permissions = Object.assign(permissionMap1, permissionMap2)
        return Object.keys(permissions)
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
                let resourcePermissionModel = await this.lib.db.model('ResourcePermission').findOne({resource: body.resource})
                if (!resourcePermissionModel){
                    resourcePermissionModel = this.lib.db.model('ResourcePermission')(body);
                }else {
                    resourcePermissionModel.permissions = this.mergePermissions(resourcePermissionModel.permissions, body.permissions)
                }
                const resourcePermission = await resourcePermissionModel.save()
                // if (resourcePermission && typeof resourcePermission.log === 'function'){
                //     const data = {
                //         action: `create-resource-permission of ${resourcePermission._id}`, // should capture action id for tracking e.g permission._id
                //         category: 'resource-permissions',
                //         // createdBy: req.user.id,
                //         createdBy: 'test user',
                //         message: 'Created resource-permission'
                //     }
                //     resourcePermission.log(data);
                // }
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