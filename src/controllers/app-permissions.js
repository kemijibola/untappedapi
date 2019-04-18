const BaseController = require('./baseController');

class AppPermissions extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const appPermissions = await this.lib.db.model('AppPermission').find().cache();
        this.writeHAL(res, permissions);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const appPermissionExist = await this.lib.db.model('AppPermission').findOne({name: body.name});
                if(appPermissionExist) return next(this.transformResponse(res, false, 'DuplicateRecord', `Role-Permission with name ${appPermissionExist.name} exists.`))
                let newAppPermission = this.lib.db.model('AppPermission')(body);
                const appPermission = await newAppPermission.save();
                if (appPermission && typeof appPermission.log === 'function'){
                    const data = {
                        action: `create-app-permission of ${appPermission._id}`, // should capture action id for tracking e.g permission._id
                        category: 'app-permissions',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created app-permission'
                    }
                    permission.log(data);
                }
                const halObj = this.writeHAL(appPermission);
                return this.transformResponse(res, true, halObj, 'Create operation was successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new AppPermissions(lib);
    controller.addAction({
        'path': '/app-permissions',
        'method': 'POST',
        'summary': 'Adds a new app-permission to the database',
        'responseClass': 'AppPermission',
        'nickName': 'addAppPermission',
    }, controller.create)

    return controller;
}