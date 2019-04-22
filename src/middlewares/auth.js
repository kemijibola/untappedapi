const { JWTOPTIONS } = require('../lib/constants');
const jwt = require('jsonwebtoken');
const config = require('config');
const BaseController = require('../controllers/baseController');
const _baseController = new BaseController();

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
        return _baseController.transformResponse(res, false, 'InvalidCredentials', 'You must log in!')
    }
    const encodedJWT = authorization.substr('JWT '.length);
    // verifying the token consists of the three parts [header,payload,signature]
    const parts = encodedJWT.split('.');
    if (parts.length !== 3){
        return _baseController.transformResponse(res, false, 'InvalidCredentials', 'You must log in!')
    }
    
    // verifying the token is signed with valid key id
    // TODO: extend check to accomodate multiple keys, incase of future key rotation
    const header = JSON.parse(Buffer.from(parts[0], 'base64'));
    if(header.kid !== JWTOPTIONS.CURRENTKEY){
        return _baseController.transformResponse(res, false, 'InvalidCredentials', 'You must log in!')
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
        req.user = await jwt.verify(encodedJWT, config.get('public_key'), verifyOptions)
        next();
    }catch(err){
        return _baseController.transformResponse(res, false, 'InvalidCredentials', 'You must log in!')
    }

}

async function exchangeToken(req, res, next){

}
