const { UserTypes } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/api/user-types', async (req, res, next) =>{
        new UserTypes(lib).index(req, res, next)
    });

    app.post('/api/user-types', async (req, res, next) => {
        new UserTypes(lib).create(req, res, next)
    })
}