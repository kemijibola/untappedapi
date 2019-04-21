const { RolePermission } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/role-permissions', requireLogin, async (req, res, next) =>{
        new RolePermission(lib).index(req, res, next);
    });
}