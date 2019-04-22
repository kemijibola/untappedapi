class Profile {
    constructor(builder){
        this.user = builder.user;
        this.stage_name = builder.stage_name ? builder.stage_name.trim().toUpperCase() : ''
        this.physical_stats = builder.physical_stats || {}
        this.experiences = builder.experiences || []
        this.categories = builder.categories || []
        this.company_name = builder.company_name ? builder.company_name.trim().toUpperCase() : ''
        this.banner_image = builder.banner_image ? builder.banner_image.trim() : ''
        this.full_name = builder.full_name ? builder.full_name.trim() : ''
        this.location = builder.location ? builder.location.trim() : ''
        this.profile_picture = builder.profile_picture ? builder.profile_picture.trim() : ''
        this.phone_numbers = builder.phone_numbers || []
        this.short_bio = builder.short_bio ? builder.short_bio.trim() : ''
        this.social_media = builder.social_media || []
    }

    toString(){
        return JSON.stringify(this);
    }
}

module.exports = Profile