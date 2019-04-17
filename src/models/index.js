module.exports = function(db){
    return {
        "Application": require('./application'),
        "UserType": require('./userType')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db),
        "ResourcePermission": require('./resource-permission')(db),
        "Resource": require('./resource')
        // "Key": require('./key')(db)
    }
}