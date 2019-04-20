const BaseController = require('./baseController');
class Permissions extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const permissions = await this.lib.db.model('Permission').find().cache();
        this.writeHAL(res, permissions);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const permissionExist = await this.lib.db.model('Permission').findOne({name: body.name});
                if(permissionExist) return next(this.transformResponse(res, false, 'DuplicateRecord', `Permission with name ${permissionExist.name} exists.`))
                let newPermission = this.lib.db.model('Permission')(body);
                const permission = await newPermission.save();
                if (permission && typeof permission.log === 'function'){
                    const data = {
                        action: `create-permission of ${permission._id}`, // should capture action id for tracking e.g permission._id
                        category: 'permissions',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created permission'
                    }
                    permission.log(data);
                }
                const halObj = this.writeHAL(permission);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = Permissions