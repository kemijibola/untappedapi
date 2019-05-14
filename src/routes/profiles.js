const { Profiles } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/profiles', requireLogin, async (req, res, next) =>{
        new Profiles(lib).index(req, res, next)
    });

    app.post('/profiles', async (req, res, next) => {
        new Profiles(lib).create(req, res, next)
    })
}