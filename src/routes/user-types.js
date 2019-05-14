const { UserTypes } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/user-types', async (req, res, next) =>{
        new UserTypes(lib).index(req, res, next)
    });

    app.post('/user-types', async (req, res, next) => {
        new UserTypes(lib).create(req, res, next)
    })
}