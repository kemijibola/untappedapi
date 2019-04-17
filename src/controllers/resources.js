const BaseController = require('./baseController');
const { UNTAPPEDUSERTYPES } = require('../lib/constants');
const ApiResponse = require('../models/response');
const { authorizationService, emailService } = require('../services/index');
const { sendMail } = require('../lib/helpers');
const mongoose = require('mongoose');

class Resources extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const resources = this.lib.db.model('Resource').find();
        this.writeHAL(res, resources);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const resourceExist = await this.lib.db.model('Resource').findOne({ name: body.name });
                if(roleExist) return next(this.Error(res, 'DuplicateRecord', `Resource with name ${ resourceExist.name } exists.`))
                let newResource = this.lib.db.model('Resource')(body);
                const resource = await newResource.save();
                if (resource && typeof resource.log === 'function'){
                    const data = {
                        action: `create-resource of ${resource._id}`, // should capture action id for tracking e.g userType._id
                        category: 'resource',
                        // createdBy: req.user.id,
                        createdBy: 'test user',
                        message: 'Created resource'
                    }
                    resource.log(data);
                }
                return this.writeHAL(res, resource);
            }catch(err){
                next(this.Error(res, 'InternalServerError', err.message))
            }
        }else {
            next(this.Error(res, 'InvalidContent', 'Missing json data.'));
        }
    }
}

module.exports = function(lib){
    let controller = new Resources(lib);
    controller.addAction({
        'path': '/resources',
        'method': 'POST',
        'summary': 'Adds a new resource to the database',
        'responseClass': 'Resource',
        'nickName': 'addResource',
    }, controller.create)

    controller.addAction({
        'path': '/resources',
        'method': 'GET',
        'summary': 'Index page',
        'responseClass': 'Resource',
        'nickName': 'getResources',
    }, controller.index)

    return controller;
}