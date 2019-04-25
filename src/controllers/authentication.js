// login
// token exchange
// logout
const BaseController = require('./baseController');
const keys = require('../config/settings')
const { JWT_OPTIONS } = require('../lib/constants')
const { tokenExchange } = require('../lib/exchange');

class Authentication extends BaseController {
    constructor(lib){
        super()
        this.lib = lib
    }

    async login(req, res, next){

        /* In login implementation, use audience and user roles to send back scopes(permissions) of the user
        **   For example: ClientApp1 is an audience, send back roles needed for clientApp1
        */ 
        let body = req.body;
        if (body){
            try{
                if (!body.email || !body.password) { next(this.transformResponse(res, false, 'InvalidContent', 'Provide email and password.')); }
                const user = await this.lib.db.model('User').findOne({email: body.email.toLowerCase()})
                if (!user) { next(this.transformResponse(res, false, 'InvalidCredentials', 'Invalid credentials.')) }
                user.comparePassword(body.password, async (err,isMatch) => {
                    
                    if(err) {
                        next(this.transformResponse(res, false,'InvalidCredentials', 'Invalid credentials'))}
                    if(isMatch){
                        // get req.originalUrl, use url to get roles to be sent back to user
                        const toUrl = req.originalUrl;
                        // get scopes by user role of user
                        // const permissions = await getRolePermissions(user.roles);
                        const permissions = await tokenExchange(this.lib, user.roles, req.originalUrl)
                        //const permissions = await this.getRolePermissions(user.roles)
                        // generate token
                        const signOptions = {
                            issuer: `${JWT_OPTIONS.ISSUER}${req.originalUrl}`,
                            audience: '1234',
                            keyid: JWT_OPTIONS.KEYID,
                            algorithm: JWT_OPTIONS.ALG
                        }
                        const payload = {
                            permissions: permissions
                        }
                        const privateKey = keys.rsa_private[JWT_OPTIONS.KEYID].replace(/\\n/g, '\n');
                        const token = await user.generateAuthToken(privateKey, signOptions, payload);
                        // console.log(token);
                        // send back API Response to user
                        const halObj = this.writeHAL(token)
                        return this.transformResponse(res, true, halObj, 'Login successful')
                    }else {
                        
                        if (!user) { next(this.transformResponse(res, false, 'InvalidCredentials', 'Invalid credentials.')) }
                    }});
            }catch(err){
                console.log(err)
            }
        }else{
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data'))
        }
    }
    async logout(){

    }

}

module.exports = Authentication