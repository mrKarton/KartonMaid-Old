var fs = require('fs');

function getLanguage (id)
{
    return require('./guilds/' + id + ".json").language;
}

function getPrefix(id)
{
    return require('./guilds/' + id + ".json").prefix;
}

module.exports.getLang = getLanguage;
module.exports.getPrefix = getPrefix;