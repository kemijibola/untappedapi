const swagger = require("swagger-node-express")
const ErrorHandler = require('../lib/errorHandler');
const lib = require('../lib');
const bodyParser = require('body-parser');
require('../services/cache');
const keys = require('../config/settings');
const { handleError } = require('../middlewares/error.middleware');

module.exports = (options) => {
    if(!options.app){
        throw (new ErrorHandler('The app has not been started.'));
    }
    if (!options.port) {
        throw (new ErrorHandler('Authentication server must be started with an available port'))
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

    require('../routes')(lib, app)

    app.use(function(error, req, res, next) {
        handleError(error, req, res, next);
    });

    app.listen(port, () => {
        lib.logger.info(`Server started successfully on ${port}`);
        const dbSettings = {
            host: keys.database_host,
            name: keys.database_name
        };
        lib.db.connect(dbSettings, err => {
            if(err) lib.logger.error(`Error trying to connect to database: ${err}`);
            lib.logger.info('Database service successfully started');
        })
    });
    
}