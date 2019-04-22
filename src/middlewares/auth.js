const { JWTOPTIONS } = require('../lib/constants');
const jwt = require('jsonwebtoken');
const config = require('config');
const BaseController = require('../controllers/baseController');
const baseController = new BaseController();
const keys = require('../config/settings');

module.exports = {
    requireLogin: validateToken,
    exchange: exchangeToken
}

async function validateToken(req, res, next) {
    // const { token, options } = req.params
    /** options = {
     *  issuer: "Authorizing server. This server",
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
    const header = JSON.parse(Buffer.from(parts[0], 'base64'));
    if(header.kid !== keys.rsa_kid){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', 'Token is invalid.'))
    }
    const { issuer, subject, audience } = req.params;
    var verifyOptions = {
        issuer: issuer,
        subject: subject,
        audience: audience,
        expiresIn: JWTOPTIONS.EXPIRESIN,
        algorithm:  ["RS256"]
    }
    try{
        req.user = await jwt.verify(encodedJWT, keys.rsa_public_key, verifyOptions)
        console.log(req.user);
        next();
    }catch(err){
        return next(baseController.transformResponse(res, false, 'InvalidCredentials', err))
    }

}

async function exchangeToken(req, res, next){

}
