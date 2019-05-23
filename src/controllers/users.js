const BaseController = require('./baseController');
const { JWT_OPTIONS, ROLE_TYPES, TOKEN_TYPES, TEMPLATE_LINKS, MAIL_TYPES } = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
const { SignInOptions } = require('../models/custom/token-options');
const ScheduledEmail = require('../models/custom/scheduled-email');
// const config = require('config');
let keys = require('../config/settings');
// var AWS = require('aws-sdk');
// AWS.config.region = 'us-east-2b';
// var s3 = new AWS.S3();
const kue = require('../lib/kue');
require('../lib/worker');
const welcomeEmail = require('../lib/email-templates/welcome-email');
const { commonTemplatePlaceholder } = require('../lib/email-helper');
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
                const userObj = {
                    name: body.name,
                    email: body.email,
                    password: body.password
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
                    expiresIn: '2hr',
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

                emailBody = commonTemplatePlaceholder(emailBody)

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
                    kue.scheduleInstantJob(args);
                } 
                const halObj = this.writeHAL({signup: true});
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(res, this.transformResponse(res,false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
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
}

module.exports = Users