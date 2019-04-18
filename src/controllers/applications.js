const BaseController = require('./baseController');
class Applications extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const applications = await this.lib.db.model('Application').find().cache();
        this.writeHAL(res, applications);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const applicationExist = await this.lib.db.model('Application').findOne({name: body.name});
                if(applicationExist) return next(this.transformResponse(res, false, 'DuplicateRecord', `Application with name ${applicationExist.name} exists.`))
                let newApplication = this.lib.db.model('Application')(body);
                const application = await newApplication.save();
                if (application && typeof application.log === 'function'){
                    const data = {
                        action: `create-application of ${application._id}`, // should capture action id for tracking e.g permission._id
                        category: 'applications',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created application'
                    }
                    permission.log(data);
                }
                const halObj = this.writeHAL(permission);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new Applications(lib);
    controller.addAction({
        'path': '/applications',
        'method': 'POST',
        'summary': 'Adds a new application to the database',
        'responseClass': 'Application',
        'nickName': 'addApplication',
    }, controller.create)

    return controller;
}