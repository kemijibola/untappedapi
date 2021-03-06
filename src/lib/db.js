const _ = require('underscore');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let obj = {
    getModelFromSchema: getModelFromSchema,
    model: function(mName){
        return this.models[mName];
    },
    connect: function(settings, callback){
        mongoose.connect(settings.host + "/" +settings.name)
        this.connection = mongoose.connection
        this.connection.on('error', callback)
        this.connection.on('open', callback)
    },
    disconnect: function(){
        this.connection.close();
    }
}

obj.models = require('../models/')(obj)

module.exports = obj;

function translateComplexType(v, strType){
    let tmp = null;
    let type = strType || v['type'];
    switch(type){
        case 'array':
            tmp = [];
            if(v['items']['$ref'] !== null){
                tmp.push({
                    type: Schema.ObjectId,
                    ref: v['items']['$ref']
                })
            } else{
                let originalType = v['items']['type']                                 
                v['items']['type'] = translateTypeToJs(v['items']['type'])                                 
                tmp.push(translateComplexType(v['items'], originalType))
            }
        break;
        case 'object':
            tmp = {};
            let props = v['properties'];
            _.each(props, (data, k) => {
                if (data['$ref'] !== null){
                    tmp[k] = {
                        type: Schema.ObjectId,
                        ref: data['$ref']
                    }
                } else {
                    tmp[k] = translateTypeToJs (data['type'])
                }
            })
        break;
        default:
            tmp = v                        
            tmp['type'] = translateTypeToJs(type)
        break;
    }
    return tmp;
}

function getModelFromSchema(schema){
    let data = {                
        name: schema.id,                
        schema: {}        
    }
    let newSchema = {};       
    let tmp = null;
    _.each(schema.properties, (v, propName) => {                
        if(v['$ref'] != null) {                        
            tmp = {                                
                type: Schema.Types.ObjectId,                                
                ref: v['$ref']                        
            }                
        } else {
            tmp = translateComplexType(v) //{}                
        }                
        newSchema[propName] = tmp        
    })
            
    data.schema = new Schema(newSchema)        
    return data
}
function translateTypeToJs(t) {        
    if(t.indexOf('int') === 0) {                
        t = "number"        
    }        
    return eval(t.charAt(0).toUpperCase() + t.substr(1)) 
}