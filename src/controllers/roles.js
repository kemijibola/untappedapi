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
                const roleExist = await this.lib.db.model('Role').findOne({ name: body.name });
                if(roleExist) return next(this.transformResponse(res, false, 'DuplicateRecord', `Role with name ${ roleExist.name } exists.`))
                const userType = await this.lib.db.model('UserType').findById({ _id: body.user_type_id })
                if(!userType) return next(this.Error(res, 'EntityNotFound', `Could not determine user type of: ${ body.user_type_id }`))
                let newRole = this.lib.db.model('Role')(body);
                const role = await newRole.save();
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