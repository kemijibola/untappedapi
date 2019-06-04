const halson = require('halson');
const ErrorHandler = require('../lib/errorHandler');
const { ERROR_CODES } = require('../lib/constants');
const mongoose = require('mongoose');
const helpers = require('../lib/helpers');

class BaseController {
    constructor(){
    }

    transformResponse(res, status, data, message){
        return res.json({
            status: status,
            message: message,
            data: data
        })
    }

    writeHAL(obj){
        if(Array.isArray(obj)){
            let newArr = obj.map(item => {
                if (typeof(item._id) === 'string'){
                    item._id = mongoose.Types.ObjectId(item._id);
                    let json = JSON.stringify(item)               
                    return helpers.makeHAL(json);  
                }
                return item.toHAL();
            });
            obj = halson(newArr);
        }else {
            if (obj && obj.toHAL){
                obj = obj.toHAL();
            }
        }
        if (!obj){
             obj = {}
        }
        return obj;
    }
}

module.exports = BaseController;