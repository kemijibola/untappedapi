const BaseController = require('./baseController');
const { JWT_OPTIONS, ROLE_TYPES, TOKEN_TYPES, TEMPLATE_LINKS, MAIL_TYPES } = require('../lib/constants');
const { UserExists } = require('../lib/errors/user');
const { UserTypeNotFoundError} = require('../lib/errors/user-type')
const { InternalServerError } = require('../lib/errors/applicationError');
const { RoleNotFoundError } = require('../lib/errors/role');
// const config = require('config');
let keys = require('../config/settings');
// var AWS = require('aws-sdk');
// AWS.config.region = 'us-east-2b';
// var s3 = new AWS.S3();
require('../lib/worker');
const welcomeEmail = require('../lib/email-templates/welcome-email');

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
        if(body.email !== undefined || body.name !== undefined || body.user_type !== undefined || body.audience !== undefined){
            try{
                let criteria = {};
                const email = body.email.trim().toLowerCase();
                // confirm the email does not already exist in the database
                let userModel = await this.lib.db.model('User').findOne({email: email })
                if(userModel) {
                    return next(new UserExists(`There is a user registered with this email: ${ email }`))
                }
                // This is checking that the user_type sent by client is a valid type of user 
                // in the database. For Example: Talent,Audience,Professional
                const userTypeModel = await this.lib.db.model('UserType').findById({ _id: body.user_type })
                if(!userTypeModel) {
                    return next(new UserTypeNotFoundError(`Could not determine user type of: ${ body.user_type }`))
                }
                // We assign default role for all new user by user types
                criteria.$and = [
                    { user_type: userTypeModel._id },
                    { role_type: ROLE_TYPES.FREE }
                ]
                const roles = await this.lib.db.model('Role').find(criteria);
                if (!roles) {
                    return next(new RoleNotFoundError(`Roles not defined for user type ${userTypeModel._id}`)) 
                }
                const userObj = {
                    name: body.name,
                    email: body.email,
                    password: body.password,
                    user_type: userTypeModel.name
                }
                // saving new user to database
                let newUser = await this.lib.db.model('User')(userObj);
                const user = await newUser.save();

                // saving assigned roles to created user to database
                await user.addRoles(newUser._id, roles);

                // Send welcome mail to created user
                const templateString = welcomeEmail.template;
                //token sign options
                const signOptions = {
                    issuer: JWT_OPTIONS.ISSUER,
                    audience: body.audience,
                    expiresIn: keys.verification_expiresIn,
                    algorithm: keys.rsa_type,
                    keyid: keys.rsa_kid
                };

                // this is used to verify what type of token was generated. We use MAIL type
                // to signify the token is generated for mail verification and not authentication

                const payload = {
                    type: TOKEN_TYPES.MAIL
                }
                const privateKey = this.lib.helpers.getPrivateKey();

                // generate verification token
                const verificationToken = await user.generateToken(privateKey, signOptions, payload)

                // replace static text in template string with dynamic variables
                let emailBody = templateString
                        .replace('[Name]', newUser.name)
                        .replace('[VerificationUrl]', `${TEMPLATE_LINKS.PLATFORMURL}/verification?token=${verificationToken}`);

                //emailBody = this.lib. commonTemplatePlaceholder(emailBody) 
                emailBody = this.lib.helpers.templateCommonPlaceholder(emailBody);

                // create schedule job for sending mail
                const schedule = {
                    mail_type:  MAIL_TYPES.TRANSACTIONAL,
                    subject: 'Signup Welcome Email',
                    body: emailBody,
                    receiver_email: newUser.email,
                    sender_email: 'welcome@untappedpool.com',
                    date_created: new Date(),
                    schedule_date: new Date(),
                    ready_to_send: true
                }
               const newSchedule = await this.createSchedule(schedule);
                if (newSchedule) {
                    let args = {
                        jobName: 'send-instant',
                        time: newSchedule.date_created,
                        params: {
                            scheduleId: newSchedule._id
                        }
                    }
                    // add schedule job to queue for processing 
                    //kue.scheduleInstantJob(args);
                    this.lib.kue.scheduleInstantJob(args)
                } 
                const halObj = this.writeHAL({signup: true});
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                return next(new InternalServerError(`Internal Server Error. Please contact Untapped Pool's admin`))
            }
        }else {
            return next(new UserInvalidContent('Provide valid json data. /name, email, password, user_type, audience/'))
        }
    }

    async createSchedule(data){
        if (data) {
            try{
                data.is_sent = false;
                data.is_picked_for_sending = false;
                const newSchedule = await this.lib.db.model('ScheduledEmail')(data)
                return newSchedule.save();

            }catch(err){
                // log error to db
            }
        }
    } 

    async emailConfirmation(req, res, next){
        const token = req.query.token;
        const audience = req.body.audience;
        if(token && audience){
            // extra verification the token consists of the three parts [header,payload,signature]
            const parts = token.split('.');
            if (parts.length !== 3){
                return next(this.transformResponse(res, false, 'InvalidCredentials', 'Verification token is invalid.'))
            }
            // extra verification the token is signed with valid key id
            // TODO: extend check to accomodate multiple keys, incase of future key rotation
            const header = JSON.parse(Buffer.from(parts[0], 'base64'))
            const payload = JSON.parse(Buffer.from(parts[1], 'base64'))

            // this is to ensure the kid is valid
            if(header.kid !== keys.verification_kid){
                return next(this.transformResponse(res, false, 'InvalidCredentials', 'Verification token is invalid.'))
            }
            // this is to ensure the token is generated for mail verification
            if (payload.type !== TOKEN_TYPES.MAIL){
                return next(this.transformResponse(res, false, 'InvalidCredentials', 'Verification token is invalid.'))
            }
            // validate expiration 
            // validate subject/user
            var verifyOptions = {
                issuer: JWT_OPTIONS.ISSUER,
                subject: req.user._id,
                audience: payload.aud,
                expiresIn: keys.verification_expiresIn,
                // change to RS128 algorithm for verification token
                algorithm:  ["RS256"]
            }
            try {
                await jwt.verify(token, keys.verification_publicKey, verifyOptions)
                // all goes well, return success
                const halObj = this.writeHAL({verification: true});
                return this.transformResponse(res, true, halObj, 'Operation successful');

            }catch(err){
                next(res, this.transformResponse(res,false, 'InternalServerError', err.message))
            }
        }else {
         next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));   
        }

    }

}

module.exports = Users