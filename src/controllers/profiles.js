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
        if(body.user !== undefined || body.categories.length > 0){
            try{
                const { user, categories, } = body;
                const userModel = await this.lib.db.model('User').findById({_id: user}).populate('user_type')
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

                const userType = userModel.user_type.name.toUpperCase();
                let profileModel;
                switch(userType){
                    case UNTAPPED_USER_TYPES.TALENT:
                        // TODO:: physical_stats not saving to db
                        profileModel = await this.lib.db.model('Talent').findOne({user: userModel._id})
                        let talent;
                        if (!profileModel) {
                            talent = new ProfileBuilder(userModel._id)
                            .createTalent(body.stage_name, body.physical_stats)
                            .createBasicInfo(body.location, body.profile_picture, body.phone_number, body.short_bio, body.categories)
                            .addSocialMedias(body.social_media)
                            .build();
                            profileModel = this.lib.db.model('Talent')(talent);
                        }else {
                            // take existing talent object, replace with new talent object
                            talent = new ProfileBuilder(userModel._id)
                            .createTalent(body.stage_name, body.physical_stats)
                            .createBasicInfo(body.location, body.profile_picture, body.phone_number, body.short_bio, body.categories)
                            .addSocialMedias(body.social_media)
                            .build();
                            profileModel = Object.assign(profileModel, talent);
                        }
                    break;
                    case UNTAPPED_USER_TYPES.PROFESSIONAL:
                    let professional;
                    profileModel = await this.lib.db.model('Professional').findOne({user: userModel._id})
                    if (!profileModel) {
                        // create Professional class here and check for required fields
                        professional = new ProfileBuilder(userModel._id)
                        .createProfessional(body.company_name, body.banner_image)
                        .createBasicInfo(body.full_name, body.location, body.profile_picture, body.phone_numbers, body.short_bio, body.categories)
                        .addSocialMedias(body.social_media)
                        .build()
                    }else {
                        // take existing professional object, replace with new professional object
                        professional = new ProfileBuilder(userModel._id)
                        .createProfessional(body.company_name, body.banner_image)
                        .createBasicInfo(body.full_name, body.location, body.profile_picture, body.phone_numbers, body.short_bio, body.categories)
                        .addSocialMedias(body.social_media)
                        .build()
                    }
                    profileModel = Object.assign(profileModel, professional);
                    break;
                }
                const profile = await profileModel.save();
                const halObj = this.writeHAL(profile);
                return this.transformResponse(res, true, halObj, 'Operation successful');
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