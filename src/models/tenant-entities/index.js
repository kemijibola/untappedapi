module.exports = function(db){
    return {
        // "Collection": require('./collection')(db),
        // "Appointment": require('./appointment')(db),
        "Talent": require('./talent')(db),
        "Professional": require('./professional')(db),
        "Gig": require('./gig')(db),
        "PrizeType": require('./prize-type')(db),
        "Collection": require('./collection')(db),
        // "Comment": require('./comment')(db),
        // "Contest": require('./contest')(db)
    }
}