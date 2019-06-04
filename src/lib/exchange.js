const ErrorHandler = require('./errorHandler');
const mongoose = require('mongoose');

module.exports = {
    tokenExchange: exchangeToken
}

let theMergedPermissions = {};
// exchangeToken get the permission assigned to role for a particular resource
async function exchangeToken(lib, roles, destination){
    // fetch all resource permissions by each role assigned to user
    // merge all roles

    try{
        const resourceModel = await lib.db.model('Resource').findOne({name: destination})
        for (let role of roles) {
            const _roleId = mongoose.Types.ObjectId(role)
            // get role-permission by role and resource
            const rolePermissionModel = await lib.db.model('RolePermission')
                .findOne({ role: _roleId, resource: resourceModel._id}, 'permissions')
                .populate({ path: 'permissions' })

            await mergePermissions(rolePermissionModel.permissions);
        }
        return theMergedPermissions

    }catch(err){
        throw new ErrorHandler(err.message)
    }

}
async function mergePermissions(permissions){
    for (let item of permissions) {
        if(!theMergedPermissions[item['name']]) {
            theMergedPermissions[item['name']] = item['name'];
        }
    }
}