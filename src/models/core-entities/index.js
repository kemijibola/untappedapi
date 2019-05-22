module.exports = function(db){
    return {
        "Collection": require('./collection')(db),
        "Appointment": require('./appointment')(db),
        "Talent": require('./talent')(db),
        "Professional": require('./professional')(db),
        "Gig": require('./gig')(db),
        "PrizeType": require('./prize-type')(db),
        "Collection": require('./collection')(db),
        "Comment": require('./comment')(db),
        "Contest": require('./contest')(db),
        "Talent": require('./talent')(db),
        "Permission": require('./permission')(db),
        "Professional": require('./professional')(db),
        "Resource": require('./resource')(db),
        "RolePermission": require('./role-permission')(db),
        "Role": require('./role')(db),
        "ScheduledEmail": require('./scheduled-email')(db),
        "Tenant": require('./tenant')(db),
        "User": require('./user')(db),
        "UserType": require('./userType')(db),
        "Gig": require('./gig')(db)
        "Country": require('./country')(db)
    }
}