module.exports = {
    models: {
        "Collection": require('./collection'),
        "Category": require('../core-config/category'),
        "Talent": require('./talent'),
        "Professional": require('./professional'),
        "Gig": require('./gig'),
        "PrizeType": require('./prize-type'),
        // "Contest": require('./contest'),
        "ContestEntry": require('./contest-entry'),
        "EntryPoint": require('./entry-point')
    }
}