const { Uploads } = require('../controllers');
const { requireLogin } = require('../middlewares/auth');

module.exports = (lib, app) => {

    app.post('/uploads', async (req, res, next) => {
        new Uploads(lib).index(req, res, next)
    })
}