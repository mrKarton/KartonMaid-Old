var fs = require('fs');

function getLanguage (id)
{
    return require('./guilds/' + id + ".json").language;
}

function getPrefix(id)
{
    return require('./guilds/' + id + ".json").prefix;
}

function setStatChannels(arr, id)
{
    var gc = require('./guilds/' + id + ".json");
     
    gc.statChannels = arr;
    gc.statEnabled = true;
    console.log(gc);
    fs.writeFileSync('./GuildConfigs/guilds/' + id + ".json", JSON.stringify(gc), (err)=>{console.log(err)});
}


module.exports.setStatChannels = setStatChannels;
module.exports.getLang = getLanguage;
module.exports.getPrefix = getPrefix;