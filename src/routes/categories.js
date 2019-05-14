const { Categories } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/categories', async (req, res, next) => {
        new Categories(lib).index(req, res, next)
    });

    app.post('/categories', async (req, res, next) => {
        new Categories(lib).create(req, res, next)
    })
}