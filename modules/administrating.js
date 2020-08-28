var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var fs = require('fs');
var guildF = require('../GuildConfigs/functions');
var colors = require('../configurations/colors.json');

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
            msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.setPrefix.syntaxError));
        }
        else
        {
            var guildObj = require('../GuildConfigs/guilds/' + msg.guild.id + ".json");
            guildObj.prefix = args[0];

            fs.writeFile('./GuildConfigs/guilds/' + msg.guild.id + ".json", JSON.stringify(guildObj), (err)=>{if(err) console.log(err)});

            msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setDescription(lang.setPrefix.body));
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
                msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.changeLang.error));
                succ = false;
            break;
        }
        if(succ)
        {
            guildObj.language = newLang;

            fs.writeFile('./GuildConfigs/guilds/' + msg.guild.id + ".json", JSON.stringify(guildObj), (err)=>{if(err) console.log(err)});

            
            msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setDescription(lang.changeLang.succsess));
        }
    }
}

function report(bot, msg, args)
{
    if(funcs.isAdmin(msg.author, msg.guild.id, bot))
    {
        if(args.length > 1)
        {
            bot.users.cache.get(conf.karton).send(new discord.MessageEmbed().setColor(colors.info)
            .setTimestamp(new Date()).setTitle("Новое сообщение о баге.").setDescription("Сервер: " + msg.guild.name + "(" + msg.guild.id + ")" + "-" + 
            guildF.getLang(msg.guild.id)  + " \n Пользователь: " + msg.author.username + "(" + msg.author.id + ")")
            .addField("Текст сообщения:", funcs.getStrValuesAfter(0, args)));

            msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setDescription("Report sended. Thank you <3"));
        }
    }
}

async function enableStat(bot, msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(guildF.getLang(msg.guild.id) == "en")
    {
        lang = en;
    }
    
    var guildC = require('../GuildConfigs/guilds/' + msg.guild.id + '.json');

    if(!guildC.statEnabled)
    {

        msg.channel.send(new discord.MessageEmbed().setColor(colors.info).setDescription(lang.stat.processing));
        var statChanels = Array();
        var allStat = await msg.guild.channels.create('Статистика 0', {type:'voice', permissionOverwrites:[
            {
                id:msg.guild.roles.everyone.id,
                deny:["CONNECT"]
            }
        ], position: 0});
        statChanels.push(allStat.id);

        var onlineStat = await msg.guild.channels.create('Статистика 1', {type:'voice', permissionOverwrites:[
            {
                id:msg.guild.roles.everyone.id,
                deny:["CONNECT"]
            }
        ], position: 0});
        statChanels.push(onlineStat.id);

        var botStat = await msg.guild.channels.create('Статистика 2', {type:'voice', permissionOverwrites:[
            {
                id:msg.guild.roles.everyone.id,
                deny:["CONNECT"]
            }
        ], position: 0});
        statChanels.push(botStat.id);

        guildF.setStatChannels(statChanels, msg.guild.id)
        
        msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setDescription(lang.stat.eSuccess));
    }
    else
    {
        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.stat.eErr));
    }
}

function disableStat(bot, msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(guildF.getLang(msg.guild.id) == "en")
    {
        lang = en;
    }

    
    var guildC = require('../GuildConfigs/guilds/' + msg.guild.id + '.json');

    if(guildC.statEnabled)
    {
        bot.channels.cache.get(guildC.statChannels[0]).delete();
        bot.channels.cache.get(guildC.statChannels[1]).delete();
        bot.channels.cache.get(guildC.statChannels[2]).delete();

        var gc = require('../GuildConfigs/guilds/' + msg.guild.id + ".json");
        
        gc.statChannels = [];
        gc.statEnabled = false;
        fs.writeFileSync('./GuildConfigs/guilds/' + msg.guild.id + ".json", JSON.stringify(gc), (err)=>{console.log(err)});

        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.stat.dSuccess));
    }
    else
    {
        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.stat.dErr));
    }
}

module.exports.commands = [
    {name:[["префикс", "преф"], ["prefix"]], out:setPrefix, ab:["Изменение префикса(в качестве аргумента укажите префикс)",
    "Changing the prefix(specify the prefix as an argument)"]},
    {name:[["language", "язык"], ["language", "lang"]], out:setLang, ab:["Изменить язык бота на сервере/Change the bot language on the server", 
    "Change the bot language on the server"]},
    {name:[["репорт"], ["report"]], out:report, ab:["Нашли баг? Сообщите нам о нём.", "Found an bug? Unexpected error? Talk me about it!"]},
    {name:[["статистика.включить", "стат.включить", "стат.вкл"],["statistic.enable", "stat.enable"]], out:enableStat, ab: ["Включитие статистику сервера, которая будет описана в списке каналов",
    "turn on the servers statistic. I'll print it in channels list"]},
    {name:[["статистика.выключить", "стат.выключить", "стат.выкл"], ["statistic.disable", "stat.disable"]], out:disableStat, ab: ["Отключение статистики сервера. Каналы будут удалены автоматически",
    "Disable the server stats. I'll delete() this channels."]}
];

module.exports.about = {name:[["админ", "администрирование"], ["admin", "admining"]], about:["Изменение префикса, языка и многого другого здесь!", 
"Change the prefix, language, and more here!"]}