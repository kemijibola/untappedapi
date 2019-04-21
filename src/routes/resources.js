const { Resources } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/resources', async (req, res, next) =>{
        new Resources(lib).index(req, res, next);
    });

    app.post('/api/resources', async (req, res, next) =>{
        new Resources(lib).create(req, res, next);
    });
}