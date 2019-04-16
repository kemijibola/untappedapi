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
                if(permissionExist) return next(this.Error(res, 'DuplicateRecord', `Permission with name ${permissionExist.name} exists.`))
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
                return this.writeHAL(res, permission);
            }catch(err){
                next(this.Error(res, 'InternalServerError', err.message))
            }
        }else {
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new Permissions(lib);
    controller.addAction({
        'path': '/permissions',
        'method': 'POST',
        'summary': 'Adds a new permission to the database',
        'responseClass': 'Permission',
        'nickName': 'addPermission',
    }, controller.create)

    return controller;
}