const { Collections } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/collections', requireLogin, async (req, res, next) =>{
        new Collections(lib).index(req, res, next);
    });

    
}