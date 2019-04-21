const { Roles } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/roles', requireLogin, async (req, res, next) => {
        new Roles(lib).index(req, res, next)
    });

    app.post('/api/roles', async (req, res, next) => {
        new Roles(lib).create(req, res, next)
    })
}