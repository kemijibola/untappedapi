const BaseController = require('./baseController');
const keys = require('../config/settings')
const { JWT_OPTIONS, TOKEN_TYPES } = require('../lib/constants')
const UserNotFoundError = require('../lib/errors/user');

class Authentication extends BaseController {
    constructor(lib){
        super()
        this.lib = lib
    }

    async login(req, res, next){
        /* In login implementation, use requested route to send back permissions of the user
        ** permission assigned to role for a particular resource
        **   For example: talents is a resource, send back permissions needed for only talents 
        */ 
        let body = req.body;
        if (body){
            try{
                // if (body.audience === undefined) {
                //     console.log('audience')
                // }
                if (body.email === undefined || body.password === undefined || body.audience === undefined) {
                    return next(this.transformResponse(res, false, 'InvalidContent', 'Provide email, password and audience')); 
                }
                const user = await this.lib.db.model('User').findOne({email: body.email.toLowerCase()})
                if (!user) { 
                    // throw new UserNotFoundError(body.email)
                    return next(new UserNotFoundError(`${body.email} is not a valid user`))
                    //return next(this.transformResponse(res, false, 'EntityNotFound', 'Invalid user')) 
                }
                user.comparePassword(body.password, (err, isMatch) => {
                    console.log(err);
                    if (err) { 
                        return done(err);
                     }
                    if (isMatch) {
                      return done(null, user);
                    }
                    return done(null, false, 'Invalid credentials.');
                });
            }catch(err){
                //console.log(err)
                return next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else{
            return next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data'))
        }
    }
    async logout(){

    }

}

module.exports = Authentication