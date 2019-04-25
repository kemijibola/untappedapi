const halson = require('halson');

module.exports = {
    makeHAL: makeHAL
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