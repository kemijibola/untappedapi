module.exports = {
    tokenExchange: exchangeToken
}

async function exchangeToken(lib, roles, destination){
    destination = '/categories';
    const url = await lib.db.model('Resource').findOne({name: destination})

    let scopes = await roles.reduce(async (scopeMap, theRole, index) => {
        scopeMap[theRole] = await lib.db.model('RolePermission')
            .find({ role: theRole }, 'resourcePermission')
            .populate(
                {
                    path: 'resourcePermission',
                    match: { resource: url._id },
                    select: 'permissions -_id'
                }
            )
        return scopeMap
    }, {})

    for (let key in scopes){
        scopes[key] = scopes[key].filter(x => x.resourcePermission !== null)
    }
    return scopes;
}