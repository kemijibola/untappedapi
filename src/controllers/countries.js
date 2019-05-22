const BaseController = require('./baseController');

class Countries extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const countries = await this.lib.db.model('Country').find({});
        const halObj = this.writeHAL(countries);
        return this.transformResponse(res, true, halObj, 'Fetch operation successful');
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                let countryModel = await this.lib.db.model('Country').findOne({ name: body.name });
                console.log(1)
                if(countryModel) return next(this.transformResponse(res, false, 'DuplicateRecord', `Tenant with name ${ countryModel.name } exists.`))
                countryModel = this.lib.db.model('Country')(body);
                const country = await countryModel.save();

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
                const halObj = this.writeHAL(country);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                console.log(err)
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = Countries;