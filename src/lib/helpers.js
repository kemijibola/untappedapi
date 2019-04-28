const halson = require('halson');

module.exports = {
    makeHAL: makeHAL,
    mergeLists: mergeLists
}

function makeHAL(data, links, embed){
    let obj = halson(data);
    if (links && links.length > 0){
        links.forEach(link => {
            obj.addLink(link.name, {
                href: link.href,
                title: link.title || ''
            })
        });
    }
    if (embed && embed.length > 0){
        embed.forEach(item => {
            obj.addEmbed(item.name, item.data)
        });
    }
    return obj;
}

function mergeLists(list1, list2){
    let listMap1 = list1.reduce((theMap, theItem) => {
        if(theItem) theMap[theItem] = theItem
        return theMap;
    },{})
    let listMap2 = list2.reduce((theMap, theItem) => {
        if(theItem) theMap[theItem] = theItem
        return theMap;
    },{})

    let merged = Object.assign(listMap1, listMap2)
    return Object.keys(merged)
}