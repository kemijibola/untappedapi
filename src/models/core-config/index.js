module.exports = function(db){
    return {
        "Tenant": require('./tenant')(db),
        "UserType": require('./userType')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db),
        "RolePermission": require('./role-permission')(db),
        "Resource": require('./resource'),
        "Category": require('./category')(db),
        "Permission": require('./permission')(db),
        "ScheduledEmail": require('./scheduled-email')
    }
}