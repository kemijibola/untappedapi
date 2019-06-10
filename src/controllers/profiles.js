const BaseController = require('./baseController');
const mongoose = require('mongoose');
const ProfileBuilder = require('../builder/profileBuilder');
const { UNTAPPED_USER_TYPES } = require('../lib/constants');
const { UserNotFoundError } = require('../lib/errors/user');
const { CategoryNotFoundError} = require('../lib/errors/category');

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
        // validate important inputs: phone_number, categories etc
        if(body.user !== undefined){
            try{
                const { user, categories, } = body;
                const userModel = await this.lib.db.model('User').findById({_id: user})
                if(!userModel) {
                    return next(new UserNotFoundError(`User with id ${user} not found`))
                }
                // TODO: validating client's parameters
                // type cast string id to mongoose ObjectId
                let categoriesMap = body.categories.reduce((acc, item) => {
                    acc[item] = mongoose.Types.ObjectId(item);
                    return acc
                }, {})
                // if categories supplied by user, validate catetegory id is valid
                for (const item in categoriesMap){
                    const found = await this.lib.db.model('Category').findById({_id: item})
                    if(!found) {
                        return next(new CategoryNotFoundError(`Invalid category with id ${item}`))
                    }
                }

                body.categories = [...Object.keys(categoriesMap)];

                const userType = userModel.user_type.toUpperCase();
                let profileModel;
                switch(userType){
                    case UNTAPPED_USER_TYPES.TALENT:
                        // TODO:: physical_stats not saving to db
                        profileModel = await this.lib.db.model('Talent').findOne({user: userModel._id})
                        let talent;
                        body._id = userModel._id
                        if (!profileModel) {
                            talent = this.buildProfile(userType, body)
                            profileModel = this.lib.db.model('Talent')(talent);
                        }else {
                            // take existing talent object, replace with new talent object
                            talent = this.buildProfile(userType, body)
                            profileModel = Object.assign(profileModel, talent);
                        }
                    break;
                    case UNTAPPED_USER_TYPES.PROFESSIONAL:
                    let professional;
                    body._id = userModel._id
                    profileModel = await this.lib.db.model('Professional').findOne({user: userModel._id})
                    if (!profileModel) {
                        // create Professional class here and check for required fields
                        professional = this.buildProfile(userType, body)
                        profileModel = this.lib.db.model('Professional')(professional);
                    }else {
                        // take existing professional object, replace with new professional object
                        professional = this.buildProfile(userType, body)
                        profileModel = Object.assign(profileModel, professional);
                    }
                    break;
                    default:
                        break;
                }
                const profile = await profileModel.save()
                const halObj = this.writeHAL(profile)

                return this.transformResponse(res, true, halObj, 'Operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }

    buildProfile(typeOfUser, data){
        switch(typeOfUser) {
            case UNTAPPED_USER_TYPES.TALENT:
                return new ProfileBuilder(data._id)
                .createTalent(data.stage_name, data.physical_stats)
                .createBasicInfo(data.location, data.profile_picture, data.phone_number, data.short_bio, data.categories)
                .addSocialMedias(data.social_media)
                .build();
            case UNTAPPED_USER_TYPES.PROFESSIONAL:
                return new ProfileBuilder(data._id)
                .createProfessional(data.company_name, body.banner_image)
                .createBasicInfo(data.full_name, data.location, data.profile_picture, data.phone_number, data.short_bio, data.categories)
                .addSocialMedias(data.social_media)
                .build()
            default:
                break;
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