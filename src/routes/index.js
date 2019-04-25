module.exports = (lib, app) => {
    require('./roles')(lib,app),
    require('./users')(lib,app),
    require('./user-types')(lib,app),
    require('./categories')(lib,app),
    require('./permissions')(lib,app),
    require('./profiles')(lib,app),
    require('./resources')(lib,app),
    require('./role-permissions')(lib,app),
    require('./resource-permissions')(lib,app),
    require('./collections')(lib,app),
    require('./applications')(lib,app),
    require('./uploads')(lib,app),
    require('./authentication')(lib,app)
}