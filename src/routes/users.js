const { Users } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/users', requireLogin, async (req, res, next) => {
        new Users(lib).index(req, res, next)
    });

    app.post('/users', async (req, res, next) => {
        new Users(lib).signup(req, res, next)
    })
}