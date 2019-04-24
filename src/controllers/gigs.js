const BaseController = require('./baseController');
class Gigs extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const collections = await this.lib.db.model('Collection').find().cache();
        this.writeHAL(res, collections);
    }

    async lists(req, res, next){
        // all collections in db
        let criteria = {};
        if(req.params.q){
            let expr = new RegExp('.*' + req.params.q + '.*')
            criteria.$or = [
                {title: expr},
                {short_words: expr}
            ]
        }
        if(req.params.from_date){
            criteria.upload_date = { $gte: req.params.from_date}
        }
        if(req.params.to_date){
            criteria.upload_date = {$lte: req.params.to_date}
        }
        if(req.params.media_type){
            criteria.media_type = req.params.media_type   
        }
        // this will fetch collections by talent, if talent_id params is sent
        if(req.params.talent_id){
            criteria.user = req.params.talent_id
        }
        const gigs = await this.lib.db.model('Collection')
            .find(criteria)
            .populate('user')
            .populate({path:'comments.user',model:'user'})
            .populate({path: 'replies.user', model: 'user'})
            .exec().cache();

        const halObj = this.writeHAL(gigs);
        return this.transformResponse(res, true, halObj, 'Find operation successful'); 
    }
    async details(){
        // find one collection by id
    }

    async create(req, res, next){
        const body = req.body;
        const { medias } = body;
        // user must send medias to upload
        if (medias.length < 1) return next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'))
        if(body){
            try{
                let gigModel = this.lib.db.model('Gig')(body);
                const gig = await gigModel.save();
                const halObj = this.writeHAL(gig);
                return this.transformResponse(res, true, halObj, 'Create operation successful');

            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'))
        }
    }

    async update(req, res, next){
        const id = req.params.id.trim();
        const body = req.body
        if(body && id){
            try{
                let gigModel = await this.lib.db.model('Gig').findById({_id: id})

                // Only allow user to update reciever_deleted and sender_deleted
                body.sender = gigModel.sender
                body.reciever = gigModel.reciever
                body.note = gigModel.note
                body.sent_date = gigModel.sent_date
                body.items = gigModel.items
                body.reciever_deleted = body.reciever_deleted
                body.sender_deleted = body.sender_deleted

                gigModel = Object.assign(gigModel, body)
                const updateObj = await gigModel.save();
                const halObj = this.writeHAL(updateObj.toJSON());
                return this.transformResponse(res, true, halObj, 'Update operation successful');

            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'))
        }
    }
}

module.exports = Gigs