const { Categories } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/categories', requireLogin, async (req, res, next) =>{
        new Categories(lib).index(req, res, next);
    });
}