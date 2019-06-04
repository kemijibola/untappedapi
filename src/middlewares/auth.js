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
    
    // the verify options should be from the token that was sent by the user
    // look into that
    var verifyOptions = {
        issuer: payload.issuer,
        subject: req.user._id,
        audience: payload.aud,
        expiresIn: payload.expiresIn,
        algorithm:  payload.algorithm
    }
    try{
        const decoded = await jwt.verify(encodedJWT, keys.rsa_public_key, verifyOptions)
        const destinationResourceUrl = `${JWT_OPTIONS.ISSUER}${req.originalUrl}`
        
        // this is a check to see if destinationUrl is the same as the current token issuer
        // if it is, return decoded immediately
        if(destinationResourceUrl === decoded.iss){
            req.user = decoded
            return next()
        }
        // otherwise, get the user roles
        const userModel = await lib.db.model('User').findById({_id: decoded.sub});
        // get persmissions for the roles assigned to the user
        const permissions = await tokenExchange(lib, userModel.roles, req.originalUrl)
        // generate new token and send it to client with response.headers('Authorization')
        // set req.user = decoded
        const payload = {
            permissions: permissions
        }
        
        const signOptions = {
            issuer: `${JWT_OPTIONS.ISSUER}${req.originalUrl}`,
            audience: payload.aud,
            keyid: JWT_OPTIONS.KEYID,
            algorithm: JWT_OPTIONS.ALG
        }
        // generate a new token for user
        const token = await userModel.generateAuthToken(keys.rsa_private[JWT_OPTIONS.KEYID], signOptions, payload);
        // set response header
        res.setHeader('authorization', token)
        // set payload for the user object
        req.user = {
            permissions: permissions,
            sub: userModel._id
        }
        return next()
        
    }catch(err){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', err))
    }

}

