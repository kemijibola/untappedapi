const Profile = require('./profile');

class ProfileBuilder {
    constructor(user){
        this.user = user
    }

    createTalent(stageName= '', physicalStats= {}, experiences= []){
        this.stage_name = stageName
        this.physical_stats = {
            height: physicalStats.height,
            body_type: physicalStats.body_type,
            color: physicalStats.color
        }
        this.experiences = experiences
        return this;
    }
    createProfessional(companyName= '', bannerImage= ''){
        this.company_name = companyName
        this.banner_image = bannerImage
        return this;
    }
    createBasicInfo(fullName, location= '', profilePicture= '', phoneNumbers= [], shortBio= '', categories= []){
        this.full_name = fullName
        this.location = location
        this.profile_picture = profilePicture
        this.phone_numbers = phoneNumbers
        this.short_bio = shortBio
        this.categories = categories
        return this;
    }
    addSocialMedias(handles= []){
        this.social_media = handles
        return this;
    }
    build(){
        return new Profile(this);
    }
}

module.exports = ProfileBuilder