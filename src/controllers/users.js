const BaseController = require('./baseController');
const { JWTOPTIONS, ROLETYPES} = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
// const config = require('config');
let keys = require('../config/settings');
// var AWS = require('aws-sdk');
// AWS.config.region = 'us-east-2b';
// var s3 = new AWS.S3();
class Users extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }
    async login(req, res, next){

        /* In login implementation, use audience and user roles to send back scopes(permissions) of the user
        **   For example: ClientApp1 is an audience, send back roles needed for clientApp1
        */ 
        let body = req.body;
        if (body){
            if (!body.email || !body.password) { next(this.Error('InvalidContent', 'Provide email and password.')); }
            const user = await this.lib.model('User').findOne({email: body.email.toLowerCase()})
            if (!user) { next(this.Error('InvalidCredentials', 'Invalid credentials.')) }
            user.comparePassword(body.password, async (err,isMatch) => {
                if(err) {
                    next(this.Error('InvalidCredentials', 'Invalid credentials'))}
                if(isMatch){
                    // get scopes by user role of user
                    const scopes = await authorizationService(user.roles);
                    // generate token
                    const token = await user.generateAuthToken();
                    // send back API Response to user
                    this.writeHAL(res, new ApiResponse(user, token, scopes));
                }else {
                    this.Error('InvalidCredentials', 'Invalid credentials')}});
        }else{
            next(this.Error('InvalidContent', 'Missing json data'));}
    }

    async signup(req, res, next){
        const body = req.body;
        if(body){
            try{
                let criteria = {};
                const email = body.email.trim().toLowerCase();
                // confirm the email does not already exist in the database
                let userModel = await this.lib.db.model('User').findOne({email: email })
                if(userModel) return next(this.transformResponse(res, false, 'DuplicateRecord', `There is a user registered with this email: ${ email }`))

                // This is checking that the user_type sent by client is a valid type of user 
                // in the database. For Example: Talent,Audience,Professional
                const userType = await this.lib.db.model('UserType').findById({ _id: body.user_type })
                if(!userType) return next(this.transformResponse(res, false, 'ResourceNotFound', `Could not determine user type of: ${ body.user_type }`))
                
                // We assign default role for all new user by user types
                criteria.$and = [
                    { user_type: userType._id },
                    { role_type: 'FREE' }
                ]
                const roles = await this.lib.db.model('Role').find(criteria);
                
                const newUser = await this.createUser(roles, body);
                // send WelcomePack Mail based on type of user

                const halObj = this.writeHAL(newUser);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(res, this.transformResponse(res,false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }

    async emailExist(req, res, next){
        let body = req.body
        if (body){
            try {
                const email = body.email.trim().toLowerCase();
                const found = await this.lib.model('User').findOne({ email: email });
                if(found)
                this.writeHAL(res, email);
            }catch(err){
                next(this.Error('InternalServerError', err));
            }
        }else {
            next(this.Error('InvalidContent', 'Missing json data'));
        }
    }

    async createUser(roles, body){
        let signOptions = {
            issuer: JWTOPTIONS.ISSUER,
            subject: '',
            audience: body.audience,
            expiresIn: JWTOPTIONS.EXPIRESIN,
            algorithm: keys.rsa_type,
            keyid: keys.rsa_kid
        }
        const userObj = {
            email: body.email,
            password: body.password    
        }
        const payload = {
            permissions: []
        };
        const privateKey = keys.rsa_private[JWTOPTIONS.CURRENTKEY].replace(/\\n/g, '\n');

        // saving new user to database
        let newUser = await this.lib.db.model('User')(userObj);
        const user = await newUser.save();
        
        // The user has not yet verified email, sending them a token with empty scopes
        // is to allow them into the app with limited permissions
        // This is applicable to all types of users in the database

        const token = await user.generateAuthToken(privateKey, signOptions, payload);
        await user.addRoles(user._id, roles);
        return { token: token };
    }

    async getCurrentApiKey(){
        // production implementation store private key in (AWS)

        let params = {
            Bucket: 'jether-tech-credentials',
            Key: 'web-app/secretKeys.json'
        }
        s3.getObject(params, function(err, data) {
            if (err) {
                console.log('error',err);
            } else {
                data = JSON.parse(data.Body.toString());
                for (i in data) {
                    console.log('Setting environment variable: ' + i);
                    process.env[i] = data[i];
                }
            }
        });
    }

    async sendWelcomePack(data){
        // pass payload to email Service
        sendMail(body)
    }  
}

module.exports = Users