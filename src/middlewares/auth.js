const { JWT_OPTIONS } = require('../lib/constants');
const jwt = require('jsonwebtoken');
const BaseController = require('../controllers/baseController');
const baseController = new BaseController();
const keys = require('../config/settings');
const lib = require('../lib')
const { tokenExchange } = require('../lib/exchange')

module.exports = {
    requireLogin: validateToken
}

async function validateToken(req, res, next) {
    
    // const { token, options } = req.params
    /** options = {
     *  issuer: "Authorizing server. This server + endpoint",
     *  subject: The user that owns token
     *  audience: the client the token was generated for.
     * }
     * */ 
    const authorization = req.headers["x-access-token"] || req.headers["authorization"];
    if (authorization === null || typeof authorization === 'undefined'){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', 'Header is not set.'))
    }
    const encodedJWT = authorization.substr('JWT '.length);

    // extra verification the token consists of the three parts [header,payload,signature]
    const parts = encodedJWT.split('.');
    if (parts.length !== 3){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', 'Token is invalid.'))
    }
    // extra verification the token is signed with valid key id
    // TODO: extend check to accomodate multiple keys, incase of future key rotation
    const header = JSON.parse(Buffer.from(parts[0], 'base64'))
    const payload = JSON.parse(Buffer.from(parts[1], 'base64'))

    if(header.kid !== keys.rsa_kid){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', 'Token is invalid.'))
    }
    // TODO:: Handle parameters expected from client audience
    var verifyOptions = {
        issuer: payload.iss,
        subject: payload.sub,
        audience: payload.audience,
        expiresIn: JWT_OPTIONS.EXPIRESIN,
        algorithm:  ["RS256"]
    }
    try{
        
        //const decoded = await jwt.verify(encodedJWT, keys.rsa_public_key, verifyOptions)
        const decoded = await this.verifyToken(encodedJWT, keys.rsa_public_key, verifyOptions);
        const destinationResourceUrl = `${JWT_OPTIONS.ISSUER}${req.originalUrl}`
        // check if the destination url is different from payload.iss
        // if it is different, get permissions for destination resource, sign another token to sign
        // otherwise, return decoded 
        if(destinationResourceUrl === decoded.iss){
            req.user = decoded
            return next(req)
        }
        const roles = Object.keys(decoded.permissions);
        const permissions = await tokenExchange(lib, roles, req.originalUrl)
        // generate new token and send it to client with response.headers('Authorization')
        // set req.user = decoded
        const payload = {
            permissions: permissions
        }
        
        const signOptions = {
            issuer: `${JWT_OPTIONS.ISSUER}${req.originalUrl}`,
            audience: '1234',
            keyid: JWT_OPTIONS.KEYID,
            algorithm: JWT_OPTIONS.ALG
        }
        const userModel = await lib.db.model('User').findById({_id: decoded.sub});
        const token = await userModel.generateAuthToken(keys.rsa_private[JWT_OPTIONS.KEYID], signOptions, payload);
        res.setHeader('authorization', token)
        req.user = {
            permissions: permissions,
            sub: decoded.sub
        }
        return next()
        
    }catch(err){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', err))
    }

}

 verifyToken = async (encodedJWT, key, options) => {
    try{
        return await jwt.verify(encodedJWT, key, options)
    }catch(err){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', err))
    }
}
