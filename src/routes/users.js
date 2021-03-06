const { Users } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/users', requireLogin, async (req, res, next) => {
        new Users(lib).index(req, res, next)
    })

    app.post('/signup', async (req, res, next) => {
        new Users(lib).signup(req, res, next)
    })
    app.get('/users/:query', async (req, res, next) => {
        new Users(lib).details(req, res, next)
    })
    app.post('/verification?token', async () => {
        new Users(lib).emailConfirmation(req, res, next)
    })
}