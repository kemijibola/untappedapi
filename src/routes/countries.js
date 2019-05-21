const { Countries } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {
    app.get('/countries', async (req, res, next) =>{
        new Countries(lib).index(req, res, next)
    });

    app.post('/countries', async (req, res, next) => {
        new Countries(lib).create(req, res, next)
    })
}