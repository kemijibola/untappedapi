module.exports = function(db){
    return {
        "Application": require('./application'),
        "UserType": require('./userType')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db),
        "ResourcePermission": require('./resource-permission')(db),
        "Resource": require('./resource'),
        "Collection": require('./collection')(db),
        "Profile": require('./profile')(db)
    }
}