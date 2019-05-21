const swagger = require("swagger-node-express")
const ErrorHandler = require('../lib/errorHandler');
const lib = require('../lib');
const bodyParser = require('body-parser');
require('../services/cache');
const settings = require('../config/settings');

module.exports = (options) => {
    const tenantConfig = null;
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

    app.listen(port, () => {
        lib.logger.info(`Server started successfully on ${port}`);
        // lib.db.connect(err => {
        //     if(err) lib.logger.error(`Error trying to connect to database: ${err}`);
        //     lib.logger.info('Database service successfully started');
        // })
    });

    app.use((req, res, next) => {
        const dbSettings = {
            host: settings.database_host,
            name: settings.database_name
        };
        const audience = req.originalUrl;
        console.log(audience);
        if(!audience)
        throw new ErrorHandler('The domain is not set');
        const domainRegex = RegExp('^((localhost)|((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,253})$')

        if (!domainRegex.test(audience))
            throw new ErrorHandler('The domain is not a valid domain')

        if (tenantConfig === null){
            lib.db.connect(dbSettings, err => {
                if(err) lib.logger.error(`Error trying to connect to database: ${err}`)
                lib.logger.info('Database service successfully started')
                lib.db.modelPath('../models/core-config')
            });
        }
        const tenant = lib.db.model('Talent').findOne({domain_name: audience && isActive }).cache()
        if(!tenant)
            throw new ErrorHandler('The domain is not valid')
        tenantConfig = tenant;
    })

    // if config settings is loaded correctly
    // Get tenant configuration connection and settings and cache request        
    // start tenant db 
    
}