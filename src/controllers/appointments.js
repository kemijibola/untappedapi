const BaseController = require('./baseController');

class Appointments extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const categories = this.lib.db.model('Appointment').find();
        this.writeHAL(res, categories);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                let newAppointment = this.lib.db.model('Appointment')(body);
                const appointment = await newAppointment.save();
                const halObj = this.writeHAL(appointment);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }

}

module.exports = Appointments