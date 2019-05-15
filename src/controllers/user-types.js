const BaseController = require('./baseController');
class UserTypes extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const roles = await this.lib.db.model('UserType').find({ global: true });
        const halObj = this.writeHAL(roles);
        return this.transformResponse(res, true, halObj, 'Fetch operation successful');
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                let userTypeModel = await this.lib.db.model('UserType').findOne({name: body.name});
                if(userTypeModel) return next(this.transformResponse(res, false, 'DuplicateRecord', `User type with name ${userTypeExist.name} exists.`))
                userTypeModel = this.lib.db.model('UserType')(body);
                const userType = await userTypeModel.save();
                if (userType && typeof userType.log === 'function'){
                    const data = {
                        action: `create-user-type of ${userType._id}`, // should capture action id for tracking e.g userType._id
                        category: 'user-types',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created user type'
                    }
                    userType.log(data);
                }
                const halObj = this.writeHAL(userType);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = UserTypes