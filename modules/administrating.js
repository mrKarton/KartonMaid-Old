var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var fs = require('fs');
var guildF = require('../GuildConfigs/functions');
const { createGunzip } = require('zlib');


function setPrefix(bot, msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(guildF.getLang(msg.guild.id) == "en")
    {
        lang = en;
    }

    if(funcs.isAdmin(msg.author, msg.guild.id, bot))
    {
        if (args.length > 1)
        {
            msg.reply(lang.setPrefix.syntaxError);
        }
        else
        {
            var guildObj = require('../GuildConfigs/guilds/' + msg.guild.id + ".json");
            guildObj.prefix = args[0];

            fs.writeFile('./GuildConfigs/guilds/' + msg.guild.id + ".json", JSON.stringify(guildObj), (err)=>{if(err) console.log(err)});

            msg.reply(lang.setPrefix.body);
        }
    }
}

function setLang(bot,msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(guildF.getLang(msg.guild.id) == "en")
    {
        lang = en;
    }

    if(funcs.isAdmin(msg.author, msg.guild.id, bot))
    {
        var guildObj = require('../GuildConfigs/guilds/' + msg.guild.id + ".json");
        
        var succ = true;

        var newLang = "";
        switch(args[0])
        {
            case "rus":
            case "рус":
                newLang = "rus";
            break;

            case "en":
            case "англ":
                newLang = "en";
            break;

            default:
                newLang = guildObj.language;
                msg.reply(lang.changeLang.error);
                succ = false;
            break;
        }
        if(succ)
        {
            guildObj.language = newLang;

            fs.writeFile('./GuildConfigs/guilds/' + msg.guild.id + ".json", JSON.stringify(guildObj), (err)=>{if(err) console.log(err)});

            
            msg.reply(lang.changeLang.succsess)
        }
    }
}

module.exports.commands = [
    {name:[["префикс", "преф"], ["prefix"]], out:setPrefix, ab:["Изменение префикса(в качестве аргумента укажите префикс)",
    "Changing the prefix(specify the prefix as an argument)"]},
    {name:[["language", "язык"], ["language", "lang"]], out:setLang, ab:["Изменить язык бота на сервере/Change the bot language on the server", 
    "Change the bot language on the server"]}
];

module.exports.about = {name:[["админ", "администрирование"], ["admin", "admining"]], about:["Изменение префикса, языка и многого другого здесь!", 
"Change the prefix, language, and more here!"]}