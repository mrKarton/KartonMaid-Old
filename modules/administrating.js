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

    if(guildF.get(msg.guild.id).Language == 'en')
    {
        lang = en;
        
    }


        if (args.length > 1)
        {
            console.log('err');
            msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.setPrefix.syntaxError));
        }
        else
        {
            console.log('set')
            var guild = guildF.get(msg.guild.id);

            guild.Prefix = args[0];

            guildF.set(guild);

            msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setDescription(lang.setPrefix.body));
        }
    
}

function setLang(bot,msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(guildF.get(msg.guild.id).Language == "en")
    {
        lang = en;
    }


        var guildObj = guildF.get(msg.guild.id);
        
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
            guildObj.Language = newLang;

            guildF.set(guildObj);

            
            msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setDescription(lang.changeLang.succsess));
        }
    
}

function report(bot, msg, args)
{
    if(funcs.isAdmin(msg.author, msg.guild.id, bot))
    {
        if(args.length > 1)
        {
            var guild = guildF.get(msg.guild.id);
            var embed = (new discord.MessageEmbed().setColor(colors.info)
            .setTimestamp(new Date()).setTitle("Новое сообщение о баге.")
            .addField("Текст сообщения:", funcs.getStrValuesAfter(0, args)))
            .addField("Пользователь", msg.author.username + " (" + msg.author.id + ")")
            .setFooter(msg.guild.name + " • " + msg.guild.id + " • " + guild.Language + " • " + msg.guild.members.cache.size,
            msg.guild.iconURL());
            bot.users.cache.get(conf.karton).send(embed);

            msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setDescription("Report sended. Thank you <3"));
        }
    }
}

async function enableStat(bot, msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(guildF.get(msg.guild.id).Language == "en")
    {
        lang = en;
    }
    
    var guildC = guildF.get(msg.guild.id);

    if(!guildC.Stat_Enabled)
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

        guildC.Stat_Channels = statChanels;
        guildC.Stat_Enabled = true;

        guildF.set(guildC)
        
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

    if(guildF.get(msg.guild.id).Language == "en")
    {
        lang = en;
    }

    
    var guildC = guildF.get(msg.guild.id);

    if(guildC.Stat_Enabled)
    {
        bot.channels.cache.get(guildC.statChannels[0]).delete();
        bot.channels.cache.get(guildC.statChannels[1]).delete();
        bot.channels.cache.get(guildC.statChannels[2]).delete();

        var gc = guildF.get(msg.guild.id);
        
        gc.Stat_Channels = [];
        gc.Stat_Enabled = false;
        guildF.set(gc);

        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.stat.dSuccess));
    }
    else
    {
        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.stat.dErr));
    }
}

function reactRole(bot, msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(guildF.get(msg.guild.id).Language == "en")
    {
        lang = en;
    }

    bot.channels.cache.get(funcs.getID(args[0])).send(funcs.getStrValuesAfter(3, args)).then(message => {

        message.react(args[2]);
        console.log(funcs.getID(args[1]));

        var allMessages = require('../configurations/role-messages.json');
        allMessages.push({
            id      : message.id, 
            channel : message.channel.id,
            guild   : message.guild.id,
            role    : funcs.getID(args[1]),
            reaction: args[2]
        });
        setTimeout(()=>{
            fs.writeFileSync('./configurations/role-messages.json', JSON.stringify(allMessages));
        }, 1000);
        msg.channel.send(new discord.MessageEmbed().setDescription(':white_check_mark: ' + lang.rolemessage + "<#" + message.channel.id + ">")
        .setColor(colors.success));
    });
}



module.exports.commands = [
    
    {name:[["префикс", "преф"], ["prefix"]], out:setPrefix, ab:["Изменение префикса(в качестве аргумента укажите префикс)",
    "Changing the prefix(specify the prefix as an argument)"], requedPremissons:["ADMINISTRATOR"]},
    
    {name:[["language", "язык"], ["language", "lang"]], out:setLang, ab:["Изменить язык бота на сервере/Change the bot language on the server", 
    "Change the bot language on the server"], requedPremissons:["ADMINISTRATOR"]},
    
    {name:[["репорт"], ["report"]], out:report, ab:["Нашли баг? Сообщите нам о нём.", "Found an bug? Unexpected error? Talk me about it!"], requedPremissons:["ADMINSTRATOR"]},
    
    {name:[["статистика.включить", "стат.включить", "стат.вкл"],["statistic.enable", "stat.enable"]], out:enableStat, ab: ["Включитие статистику сервера, которая будет описана в списке каналов \n \n Currently bugged because of new Discord politics",
    "turn on the servers statistic. I'll print it in channels list \n Currently bugged because of new Discord politics"], requedPremissons:["ADMINISTRATOR"]},
    
    {name:[["статистика.выключить", "стат.выключить", "стат.выкл"], ["statistic.disable", "stat.disable"]], out:disableStat, ab: ["Отключение статистики сервера. Каналы будут удалены автоматически",
    "Disable the server stats. I'll delete() this channels."], requedPremissons:["ADMINISTRATOR"]},
    
    {name:[["рзр", "реакция_роль", "есть_идея_для_названия_получше??"], ["rbr", "reaction-role"]], out:reactRole, 
    ab:["Пусть ваши пользователи получат то, что заслужили! Кхм.. То есть роль за то, что они поставили реакцию.. \n Использовать так: `[#канал] [@роль] [смайлик] [текст сообщения]`", 
    "Your memebers will get what they fu&#ing deserve! Oh.. I mean role by reaction.. \n So, use it like `[#channel] [@role] [emoji] [message text]`"], 
    requedPremissons:["ADMINISTRATOR"]}
    
    
];

module.exports.about = {name:[["админ", "администрирование"], ["admin", "admining"]], about:["Изменение префикса, языка и многого другого здесь!", 
"Change the prefix, language, and more here!"]}