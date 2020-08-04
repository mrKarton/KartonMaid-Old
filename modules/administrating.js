var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var fs = require('fs');

function setPrefix(bot, msg, args)
{
    if (args.length > 1)
    {
        msg.reply("В префиксе не должно быть пробелов!");
    }
    else
    {
        var guildObj = require('../GuildConfigs/guilds/' + msg.guild.id + ".json");
        guildObj.prefix = args[0];

        fs.writeFile('./GuildConfigs/guilds/' + msg.guild.id + ".json", JSON.stringify(guildObj), (err)=>{if(err) console.log(err)});

        msg.reply("префикс успешно изменён.");
    }

}

module.exports.commands = [
    {name:["prefix"], out:setPrefix}
];