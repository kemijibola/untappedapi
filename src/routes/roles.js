const { Roles } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/roles', async (req, res, next) => {
        new Roles(lib).index(req, res, next)
    });

    app.post('/roles', async (req, res, next) => {
        new Roles(lib).create(req, res, next)
    })
}