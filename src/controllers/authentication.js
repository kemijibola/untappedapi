const BaseController = require('./baseController');
const keys = require('../config/settings')
const { JWT_OPTIONS, TOKEN_TYPES } = require('../lib/constants')
const { UserNotFoundError, UserInvalidContent, InvalidCredentials, ExistingRecord, FetchUserFailed, FetchUsersFailed} = require('../lib/errors/user');
const { InternalServerError }  = require('../lib/errors/applicationError');

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
        try{
            // if (body.audience === undefined) {
            //     console.log('audience')
            // }
            if (body.email === undefined || body.password === undefined || body.audience === undefined) {
                return next(new UserInvalidContent('Provide email, password and audience'))
            }
            const userModel = await this.lib.db.model('User').findOne({email: body.email.toLowerCase()})
            if (!userModel) { 
                return next(new UserNotFoundError('Invalid user'))
            }
            const isMatch = await userModel.comparePassword(body.password)
            if (isMatch) {
                // get user permissons
                const destinationUrl = req.url.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                let permissions = await this.lib.token.tokenExchange(this.lib, userModel.roles, destinationUrl)
                permissions = Object.keys(permissions)
                const signOptions = {
                    issuer: JWT_OPTIONS.ISSUER,
                    audience: body.audience,
                    expiresIn: keys.verification_expiresIn,
                    algorithm: keys.rsa_type,
                    keyid: keys.rsa_kid
                };
                const payload = {
                    type: TOKEN_TYPES.AUTH
                }
                const privateKey = this.lib.helpers.getPrivateKey();
                // generate token for request
                const token = await userModel.generateToken(privateKey, signOptions, payload)
                const result = {
                    token,
                    permissions,
                    user: {
                        _id: userModel._id,
                        name: userModel.name,
                        user_type: userModel.user_type
                    }
                };
                const halObj = this.writeHAL(result)
                return this.transformResponse(res, true, halObj, 'Login successful')
            }else {
                return next(new InvalidCredentials('Invalid password'))
            }
        }catch(err){
            console.log(err)
            return next(new InternalServerError(`Oops this is not you, It's us. Our engineers will fix it.`))
        }
    }
    async logout(){

    }

}

module.exports = Authentication