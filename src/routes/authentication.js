const { Authentication } = require('../controllers');

module.exports = (lib, app) => {
    app.post('/authentication', async (req, res, next) =>{
        new Authentication(lib).login(req, res, next)
    });

}