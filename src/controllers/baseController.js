const halson = require('halson');
const ErrorHandler = require('../lib/errorHandler');
const { ERROR_CODES } = require('../lib/constants');
const mongoose = require('mongoose');
const helpers = require('../lib/helpers');

class BaseController {
    constructor(){
    }

    transformResponse(res, status, data, message){
        if (!status){
            const error = new ErrorHandler(`Error of type ${data} found: ${ message}`);
            if(ERROR_CODES[data]){
                return res.status(ERROR_CODES[data]).json({
                    status: status,
                    error: {
                        type: data,
                        message: error.message
                    },
                    data: {}
                })
            }else {
                return res.status(400).json({
                    status: status,
                    error: {
                        type: data,
                        message: error.message
                    },
                    data: {}
                })
            }
        }
        return res.json({
            status: status,
            message: message,
            data: data
        })
    }

    writeHAL(obj){
        console.log(obj);
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