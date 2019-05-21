const express = require('express');
const app = express();
const settings = require('./config/settings');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';
var s3 = new AWS.S3();
const Server = require('./server/server');

// server({
//     app,
//     port: settings.port
// })

new Server(app, settings.port);

// (function(){
//     let params = {
//         Bucket: 'jether-tech-credentials',
//         Key: 'web-app/config.json'
//     }
//     s3.getObject(params, function(err, data) {
//         if (err) {
//             throw (new Error('Error fetching environment variables', err))
//         } else {
//             try{
//                 data = JSON.parse(data.Body.toString());
//                 for (i in data){
//                     process.env[i] = data[i];
//                 }
//                 server({
//                     app,
//                     port: process.env['port']
//                 });
//             }catch(err){
//                 throw (new Error('Unable to set environment variables'))
//             }
//         }
//     });
// })()
