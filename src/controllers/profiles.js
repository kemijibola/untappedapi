const BaseController = require('./baseController');
const mongoose = require('mongoose');

class Profiles extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const profiles = this.lib.db.model('Profile').find();
        this.writeHAL(res, profiles);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const { user_id, categories, } = body;
                const userModel = await this.lib.db.model('User').findById({_id: user_id}).cache()
                if(!userModel) next(this.transformResponse(res, false, 'ResourceNotFoundError', 'User not found'))
                if(categories.length < 1) next(this.transformResponse(res, false, 'BadRequest', 'You must select at least one category'))
                // confirm validity of categries
                for (const category of categories){
                    const id = mongoose.Types.ObjectId(category);
                    const found = await this.lib.db.model('Category').findById({_id: id})
                    if(!found) return next(this.transformResponse(res, false, 'BadRequest', 'Invalid category'))
                }
                body.user = user._id;
                let newProfile = this.lib.db.model('Profile')(body);
                const profile = await newProfile.save();
                const halObj = this.writeHAL(profile);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }

    async update(req, res, next){
        const id = req.params.id;
        const body = req.body;
        try {
            
        }catch(err){
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = Profiles