const swagger = require("swagger-node-express")
const ErrorHandler = require('../lib/errorHandler');
const lib = require('../lib');
const bodyParser = require('body-parser');
const settings = require('../config/settings');
require('../services/cache');

class Server {

	constructor(app, port) {
        if (!app)
            throw (new ErrorHandler('The app has not been started.'));
        if (!port)
            throw (new ErrorHandler('Server must be started with an available port'))
        this.app = app;
        this.port = port;
        this.tenantConfig = null;

        this.wakeServer();
        this.validateRequest();
        this.loadRoutes();
        this.connect();
        this.getTenantConfig();
    }
    
    wakeServer() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    validateRequest() {
        // this is validating json request schema
        this.app.use((req, res, next) => {
            let results = lib.schemaValidator.validateRequest(req);
            if(results.valid){
                return next();
            }
            res.status(400).send(results);
        })
    }

    loadRoutes() {
        require('../routes')(lib, this.app);
    }
    connect() {
        this.app.listen(this.port, () => {
            lib.logger.info(`Server started successfully on ${this.port}`);
        });
    }
	getTenantConfig() {
        // connect to db here
		// first check cache for result if exist return cacheValue, return immediately, otherwise go to db to fetch
		// this.tenantConfig = go to db to fetch tenant config and set result
        // cache result and cache)
        this.app.use((req, res, next) => {
            console.log('ere');


            const audience = req.originalUrl;
            console.log(audience);
            if(!audience)
            throw new ErrorHandler('The domain is not set');
            const domainRegex = RegExp('^((localhost)|((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,253})$')

            if (!domainRegex.test(audience))
                throw new ErrorHandler('The domain is not a valid domain')

            if (this.tenantConfig === null){
                lib.db.connect(dbSettings, err => {
                    if(err) lib.logger.error(`Error trying to connect to database: ${err}`)
                    lib.logger.info('Database service successfully started')
                    lib.db.modelPath('../models/core-config')
                });
            }
            const tenant = lib.db.model('Talent').findOne({domain_name: audience && isActive }).cache()
            if(!tenant)
                throw new ErrorHandler('The domain is not valid')
            this.tenantConfig = tenant;
            return next()
        })
	}	
}

module.exports = Server;

