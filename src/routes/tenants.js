const { Tenants } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/tenants', async (req, res, next) =>{
        new Tenants(lib).index(req, res, next)
    });

    app.post('/tenants', async (req, res, next) => {
        new Tenants(lib).create(req, res, next)
    })
}