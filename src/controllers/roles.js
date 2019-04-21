const BaseController = require('./baseController');
class Roles extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const roles = this.lib.db.model('Role').find();
        this.writeHAL(res, roles);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                let roleModel = await this.lib.db.model('Role').findOne({ name: body.name });
                if(roleModel) return next(this.transformResponse(res, false, 'DuplicateRecord', `Role with name ${ roleModel.name } exists.`))
                const userTypeModel = await this.lib.db.model('UserType').findById({ _id: body.user_type })
                if(!userTypeModel) return next(this.transformResponse(res, false, 'ResourceNotFound', `Could not determine user type of: ${ body.user_type }`))
                roleModel = this.lib.db.model('Role')(body);
                const role = await roleModel.save();
                // if (role && typeof role.log === 'function'){
                //     const data = {
                //         action: `create-role of ${role._id}`, // should capture action id for tracking e.g userType._id
                //         category: 'role',
                //         // createdBy: req.user.id,
                //         createdBy: 'test user',
                //         message: 'Created role'
                //     }
                //     role.log(data);
                // }
                const halObj = this.writeHAL(role);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = Roles