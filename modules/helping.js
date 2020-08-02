var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var moduler = require('../moduler.js');

function commands(bot, msg, args)
{
    var em = new discord.MessageEmbed().setTitle("Комманды бота").setColor("#00e600")
    var c = 1;
    var inline = false;
    for(var i = 0; i < moduler.modules.length; i++)
    {   
        var allComands = " ";
        var mod = moduler.modules[i];
        for(var j = 0; j < mod.commands.length; j++)
        {
            allComands += "`" + conf.prefix + mod.commands[j].name[0] + "` - " + mod.commands[j].ab + "\n\n";
        }

        em.addField(mod.module.name[0], allComands, inline);
    }

    msg.author.send(em);
    msg.channel.send(new discord.MessageEmbed().setColor("#00e600").setDescription("<@" + msg.author.id + ">, отправила список команд тебе в личку <3"));
}

function getModule(bot, msg, args)
{
    for(var i =0; i < moduler.modules.length; i++)
    {
        if(moduler.modules[i].module.name.indexOf(args[0]) != -1)
        {
            var mod = moduler.modules[i];
            var embed = new discord.MessageEmbed().setColor("#00e600")
            .setTitle("Информация о модулe \"" + mod.module.name[0] + "\"")
            .setDescription(mod.module.about);

            var cmdStr = "";
            for(var i =0; i < mod.commands.length; i++)
            {
                cmdStr += "`" + conf.prefix + mod.commands[i].name[0] + "` - " + mod.commands[i].ab + "\n\n"
            }

            embed.addField("Команды", cmdStr, false)
            embed.addField("Альтер. названия", funcs.getStrValuesAfter(0, mod.module.name));

            embed.setFooter("`?` + команда = вызов подробной информации.");

            msg.channel.send(embed);
            break;
        }
    }
}

var list = [
    {name: ["команды"], out:commands, ab:"Показывает список команд"},
    {name: ["модуль", "module"], out:getModule, ab:"Получить оперативную информацию о модуле. (В качестве аргумента укажите название модуля)"}
]

module.exports.commands = list;
module.exports.about = {name: ["помощь"], about:"Иу-Иу-Иу! Первая коммандная помощь уже прибыла!"}