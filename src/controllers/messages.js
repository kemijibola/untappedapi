const { SignInOptions } = require('../models/custom/token-options');
const { JWT_OPTIONS, ROLE_TYPES, TOKEN_TYPES } = require('../lib/constants');
const BaseController = require('./baseController');

class Messages extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    // send welcome Email
    async sendUserSignUpEmail(req, res, next) {
        // get user id from token
        // use id to fetch user
        // generate jwt token for code verification
        // create scheduled email
        if(req.user.sub && req.user.audience){
            try{
                let userModel = this.lib.db.model('User').findById({_id: req.user.sub});
                const signOptions = new SignInOptions({
                    issuer: JWT_OPTIONS.ISSUER,
                    sub: userModel._id,
                    type: TOKEN_TYPES.MAIL,
                    audience: req.user,audience,
                    expiresIn: '2hr',
                    algorithm: JWT_OPTIONS.ALG,
                    keyid: JWT_OPTIONS.KEYID
                });

                const privateKey = this.lib.helpers.getPrivateKey();
                const verificationToken = await userModel.generateToken(privateKey, signOptions);
                // get email template as string
                // replace static placeholders with variables
                // transform template with platform's common variables
                // get sender's email address
                // 
                //let templateString = 
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))    
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'))
        }

    }
}

module.exports = Messages