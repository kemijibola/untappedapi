const swagger = require("swagger-node-express")
const ErrorHandler = require('../lib/errorHandler');
const lib = require('../lib');
const bodyParser = require('body-parser');
require('../services/cache');
const settings = require('../config/settings');
const cache = require('../services/tenant-config.cache');
const mediator = require('../lib/event-emitter');

module.exports = (options) => {
    if(!options.app){
        throw (new ErrorHandler('The app has not been started.'));
    }
    if (!options.port) {
        throw (new ErrorHandler('Server must be started with an available port'))
    }

    const { app, port } = options;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // this is validating json request schema
    app.use((req, res, next) => {
        let results = lib.schemaValidator.validateRequest(req);
        if(results.valid){
            return next();
        }
        res.status(400).send(results);
    })

    require('../routes')(lib, app);

    // This is used to fetch / set the configuration of the tenant making request
    app.use(async (req, res, next) => {
        console.log('core')
        // default database settings for core
        let dbSettings = {};
        const audience = req.body.audience;
        if(!audience) {
            lib.logger.error('The domain is not set')
            return res.status(400).send({error: 'The domain is not set'})
        }
        try{
            const key = `tenantConfig:${audience}`
            const cachedValue = await cache.getCachedData(key);
            if (cachedValue) {
                const parseCachedValue = JSON.parse(cachedValue);
                console.log(parseCachedValue)
                // Setting db settings for tenant from cachedValue
                dbSettings = {
                    host: parseCachedValue.database_host,
                    name: parseCachedValue.database_name
                }
                lib.db.connect(dbSettings, err => {
                    if(err) lib.logger.error(`Error trying to connect to database: ${err}`)
                    lib.logger.info('Database service successfully started')
                })
                return next();
            }

            // Setting core db settings
            dbSettings = {
                host: settings.database_host,
                name: settings.database_name
            };
            lib.db.connect(dbSettings, err => {
                if(err) lib.logger.error(`Error trying to connect to database: ${err}`)
                lib.logger.info('Database service successfully started')
                //mediator.emit('on.core')
            })
            const tenant = await lib.db.model('Tenant').findOne({domain_name: audience }).cache(audience)
            if(!tenant)
                return res.status(400).send({error: 'This is not a valid domain'})
            return next();
        }catch(err){
            next(`InternalServerError', ${err.message}`)
        }
    })

    app.listen(port, () => {
        lib.logger.info(`Server started successfully on ${port}`);
    });


    app.on('close', () => {
        // close all db connections on this event
        lib.db.disconnect();
    });
}