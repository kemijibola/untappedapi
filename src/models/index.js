module.exports = function(db){
    return {
        "Application": require('./application'),
        "UserType": require('./userType')(db),
        "User": require('./user')(db),
        "Role": require('./role')(db),
        "RolePermission": require('./role-permission')(db),
        "Resource": require('./resource'),
        "Collection": require('./collection')(db),
        "Category": require('./category')(db),
        "Appointment": require('./appointment')(db),
        "Permission": require('./permission')(db),
        "Resource": require('./resource')(db),
        "Talent": require('./talent')(db),
        "Professional": require('./professional')(db),
        "Gig": require('./gig')(db),
        "PrizeType": require('./prize-type')(db),
        "Contest": require('./contest')(db)
    }
}