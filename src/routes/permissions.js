const { Permissions } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/permissions', async (req, res, next) =>{
        new Permissions(lib).index(req, res, next)
    });

    app.post('/permissions', async (req, res, next) => {
        new Permissions(lib).create(req, res, next)
    })
}