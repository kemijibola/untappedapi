module.exports = function(db){
    return {
        "Application": require('./application'),
        "UserType": require('./userType')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db),
        "ResourcePermission": require('./resource-permission')(db),
        "RolePermission": require('./role-permission')(db),
        "Resource": require('./resource'),
        "Collection": require('./collection')(db),
        // "Profile": require('./profile')(db),
        "Category": require('./category')(db),
        "Appointment": require('./appointment')(db),
        "Permission": require('./permission')(db),
        "Resource": require('./resource')(db),
        "Talent": require('./talent')(db),
        "Professional": require('./professional')(db)
    }
}