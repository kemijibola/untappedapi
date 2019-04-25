const { Users } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/users', requireLogin, async (req, res, next) => {
        console.log('here')
        new Users(lib).index(req, res, next)
    });

    app.post('/api/users', async (req, res, next) => {
        new Users(lib).signup(req, res, next)
    })
}