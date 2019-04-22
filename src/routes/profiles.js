const { Profiles } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/profiles', requireLogin, async (req, res, next) =>{
        new Profiles(lib).index(req, res, next)
    });

    app.get('/api/profiles', async (req, res, next) => {
        new Profiles(lib).create(req, res, next)
    })
}