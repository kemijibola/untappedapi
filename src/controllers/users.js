const BaseController = require('./baseController');
const { JWT_OPTIONS, ROLE_TYPES, TOKEN_TYPES } = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
const { SignInOptions } = require('../models/custom/token-options');
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

    async index(req, res, next){
        try{
            const users = await this.lib.db.model('User').find()
            const halObj = this.writeHAL(users)
            return this.transformResponse(res, true, halObj, 'Fetch operation successful')
        }catch(err){
            next(res, this.transformResponse(res,false, 'InternalServerError', err.message))
        }
    }

    /**
     * Details is a get request that fetches a user by _id or email
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async details(req, res, next){
        let criteria = {};
        let id;
        if(req.params.query) {
            let query = req.params.query
            // /^[a-fA-F0-9]{24}$/
            let isMongoId = new RegExp("^[0-9a-fA-F]{24}$");
            if(isMongoId.test(query)){
                id = query
                console.log(id)
            }
            criteria.$or = [
                { _id: id },
                { email: query }
            ]
            try{
                const user = await this.lib.db.model('User').find(criteria)
                const halObj = this.writeHAL(user)
                return this.transformResponse(res, true, halObj, 'Fetch operation successful')
            }catch(err){
                next(this.transformResponse(res, false, 'InvalidContent', err.message));
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Invalid parameter'));
        }
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
                const userTypeModel = await this.lib.db.model('UserType').findById({ _id: body.user_type })
                if(!userTypeModel) return next(this.transformResponse(res, false, 'ResourceNotFound', `Could not determine user type of: ${ body.user_type }`))
                
                // We assign default role for all new user by user types
                criteria.$and = [
                    { user_type: userTypeModel._id },
                    { role_type: ROLE_TYPES.FREE }
                ]
                const roles = await this.lib.db.model('Role').find(criteria);
                
                const newUser = await this.createUser(roles, body);
                newUser.user_type = userTypeModel.name;
                // TODO:: before sending back response to client,
                // send welcome pack email based on type of user

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
        
        const signOptions = new SignInOptions(
            {
                issuer: JWT_OPTIONS.ISSUER,
                subject: '',
                type: TOKEN_TYPES.AUTH,
                audience: body.audience,
                expiresIn: JWT_OPTIONS.EXPIRESIN,
                algorithm: keys.rsa_type,
                keyid: keys.rsa_kid
            }
        );
        const userObj = {
            name: body.name,
            email: body.email,
            password: body.password
        }

        // const payload = {
        //     permissions: {}
        // };
        //const privateKey = keys.rsa_private[JWT_OPTIONS.KEYID].replace(/\\n/g, '\n');
        const privateKey = this.lib.helpers.getPrivateKey();

        // saving new user to database
        let newUser = await this.lib.db.model('User')(userObj);
        const user = await newUser.save();
        
        // The user has not yet verified email, sending them a token with empty scopes
        // is to allow them into the app with limited permissions
        // This is applicable to all types of users in the database

        const authToken = await user.generateToken(privateKey, signOptions);
        await user.addRoles(user._id, roles);
        return { token: authToken, user: user._id };
    }

    async sendWelcomePack(data){
        // pass payload to email Service
        sendMail(body)
    }  
}

module.exports = Users