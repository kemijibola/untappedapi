const keys = require('../config/settings');
const halson = require('halson');
const { JWT_OPTIONS, TEMPLATE_LINKS } = require('./constants');
module.exports = {
    makeHAL: makeHAL,
    mergeLists: mergeLists,
    getPrivateKey: getPrivateKey,
    templateCommonPlaceholder: templateCommonPlaceholder
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

function getPrivateKey() {
    return keys.rsa_private[JWT_OPTIONS.KEYID].replace(/\\n/g, '\n');
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

function templateCommonPlaceholder(templateString){
    if(templateString) {
        templateString = templateString
        .replace('[Twitter]', TEMPLATE_LINKS.TWITTER)
        .replace('[Facebook]', TEMPLATE_LINKS.FACEBOOK)
        return templateString;
    };
}