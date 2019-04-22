const BaseController = require('./baseController');
const mongoose = require('mongoose');
const ProfileBuilder = require('../builder/profileBuilder');
const { UNTAPPEDUSERTYPES } = require('../lib/constants');
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
                const { user, categories, } = body;
                const userModel = await this.lib.db.model('User').findById({_id: user}).populate('user_type')
                if(!userModel) next(this.transformResponse(res, false, 'ResourceNotFoundError', 'User not found'))
                if(categories.length < 1) next(this.transformResponse(res, false, 'BadRequest', 'You must select at least one category'))
                // confirm validity of categries

                // TODO: validating client's parameters
                // type cast string id to mongoose ObjectId
                let categoriesMap = body.categories.reduce((acc, item) => {
                    acc[item] = mongoose.Types.ObjectId(item);
                    return acc
                }, {})

                for (const item in categoriesMap){
                    const found = await this.lib.db.model('Category').findById({_id: item})
                    if(!found) return next(this.transformResponse(res, false, 'BadRequest', 'Invalid category'))
                }
                
                body.categories = [...Object.keys(categoriesMap)];
    
                // for (const category of categories){
                //     const id = mongoose.Types.ObjectId(category);
                //     const found = await this.lib.db.model('Category').findById({_id: id})
                //     if(!found) return next(this.transformResponse(res, false, 'BadRequest', 'Invalid category'))
                // }
                const userType = userModel.user_type.name.toUpperCase();
                // let newProfile = this.lib.db.model('Profile')(body);
                let newProfile;
                switch(userType){
                    case UNTAPPEDUSERTYPES.TALENT:
                        let talent = new ProfileBuilder(userModel._id)
                                        .createTalent(body.stage_name, body.physical_stats, body.experiences, body.skills)
                                        .createBasicInfo(body.full_name, body.location, body.profile_picture, body.phone_numbers, body.short_bio)
                                        .addSocialMedias(body.social_media)
                                        .build();
                        newProfile = this.lib.db.model('Talent')(talent);
                    break;
                    case UNTAPPEDUSERTYPES.PROFESSIONAL:
                        let professional = new ProfileBuilder(userModel._id)
                                                .createProfessional(body.company_name, body.banner_image, body.interests)
                                                .addSocialMedias(body.social_media)
                                                .build()
                        newProfile = this.lib.db.model('Professional')(professional);
                    break;
                }
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