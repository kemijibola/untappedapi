const express = require('express');
const app = express();
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';
var s3 = new AWS.S3();
const server = require('./server/server');


(function(){
    let params = {
        Bucket: 'jether-tech-credentials',
        Key: 'web-app/config.json'
    }
    s3.getObject(params, function(err, data) {
        if (err) {
            console.log('error',err);
        } else {
            data = JSON.parse(data.Body.toString());
            for (i in data){
                process.env[i] = data[i];
            }
            server({
                app,
                port: process.env['port']
            });
        }
    });
})()
