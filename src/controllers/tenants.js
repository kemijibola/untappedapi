const BaseController = require('./baseController');

class Tenants extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const tenants = await this.lib.db.model('Tenant').find();
        const halObj = this.writeHAL(tenants);
        return this.transformResponse(res, true, halObj, 'Fetch operation successful');
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                let tenantModel = await this.lib.db.model('Tenant').findOne({ name: body.name });
                if(tenantModel) return next(this.transformResponse(res, false, 'DuplicateRecord', `Tenant with name ${ tenantModel.name } exists.`))
                const countryModel = await this.lib.db.model('Country').findById({ _id: body.country })
                if(!countryModel) return next(this.transformResponse(res, false, 'ResourceNotFound', `Could not determine country of: ${ body.country }`))
                // TODO:: validate created_by 
                // change is_active to false before pushing to production
                body.is_active = true;
                tenantModel = this.lib.db.model('Tenant')(body);
                if (!body.payment_channels) {
                    tenantModel.payment_channels = [];
                }
                tenantModel.payment_channels = [...body.payment_channels];
                const tenant = await tenantModel.save();
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
                const halObj = this.writeHAL(tenant);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = Tenants;