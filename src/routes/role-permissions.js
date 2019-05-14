const { RolePermission } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    
    app.get('/role-permissions', requireLogin, async (req, res, next) =>{
        new RolePermission(lib).index(req, res, next)
    });

    app.post('/role-permissions', async (req, res, next) => {
        new RolePermission(lib).create(req, res, next)
    });
}