const { ResourcePermissions } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/resource-permissions', requireLogin, async (req, res, next) => {
        new ResourcePermissions(lib).index(req, res, next);
    });
    
    app.post('/resource-permissions', async (req, res, next) => {
        new ResourcePermissions(lib).create(req, res, next);
    })
}