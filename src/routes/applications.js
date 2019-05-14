const { Applications } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/applications', requireLogin, async (req, res, next) =>{
        new Applications(lib).index(req, res, next);
    });
}