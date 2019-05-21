module.exports = {
    models: {
        // "Application": require('./application'),
        "UserType": require('./userType'),
        "User": require('./user'),
        "Role": require('./role'),
        "Permission": require('./permission'),
        "RolePermission": require('./role-permission'),
        "Resource": require('./resource'),
        "Collection": require('./collection'),
        "Category": require('./category'),
        "Tenant": require('./tenant'),
        "ScheduledEmail": require('./scheduled-email')
    }
}