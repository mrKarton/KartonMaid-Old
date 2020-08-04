var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var moduler = require('../moduler.js');


var guildF = require('../GuildConfigs/functions');

function commands(bot, msg, args)
{
    var en = require('../localisation/en/helping.json');
    var rus = require('../localisation/rus/helping.json');

    var lang = rus;
    var langID = 0;

    if(guildF.getLang(msg.guild.id) == 'rus')
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var em = new discord.MessageEmbed().setTitle(lang.commands.Title).setColor("#00e600")
    var c = 1;
    var inline = false;
    for(var i = 0; i < moduler.modules.length; i++)
    {   
        var allComands = " ";
        var mod = moduler.modules[i];
        for(var j = 0; j < mod.commands.length; j++)
        {
            allComands += "`" + guildF.getPrefix(msg.guild.id) + mod.commands[j].name[langID][0] + "` - " + mod.commands[j].ab[langID] + "\n\n";
        }

        em.addField(mod.module.name[langID][0], allComands, inline);
    }

    msg.author.send(em);
    msg.channel.send(new discord.MessageEmbed().setColor("#00e600").setDescription("<@" + msg.author.id + ">," + lang.commands.Body));
}

function getModule(bot, msg, args)
{
    var en = require('../localisation/en/helping.json');
    var rus = require('../localisation/rus/helping.json');

    var lang = rus;
    var langID = 0;

    if(guildF.getLang(msg.guild.id) == 'rus')
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    for(var i =0; i < moduler.modules.length; i++)
    {
        if(moduler.modules[i].module.name[langID].indexOf(args[0]) != -1)
        {
            var mod = moduler.modules[i];
            var embed = new discord.MessageEmbed().setColor("#00e600")
            .setTitle(lang.module.title + "\"" + mod.module.name[langID][0] + "\"")
            .setDescription(mod.module.about[langID]);

            var cmdStr = "";
            for(var i =0; i < mod.commands.length; i++)
            {
                cmdStr += "`" + guildF.getPrefix(msg.guild.id) + mod.commands[i].name[langID][0] + "` - " + mod.commands[i].ab[langID] + "\n\n"
            }

            embed.addField(lang.module.commands, cmdStr, false)
            embed.addField(lang.module.alter_names, funcs.getStrValuesAfter(0, mod.module.name[langID]));

            msg.channel.send(embed);
            break;
        }
    }
}

function Info(bot, msg, args)
{
  //#region rus
    if(guildF.getLang(msg.guild.id) == "rus")
    {
      var embed = new discord.MessageEmbed().setTitle("Основная информация и помощь");
      embed.addField("О боте:", "Привет! Я твоя персональная горничная, я могу включить тебе музыку, сделаю для тебя эмбед, или покажу тебе смешной мем. \n" +
      "Для того, что бы узнать все мои команды, напиши `" + conf.prefix + module.exports.commands[0].name[0][0] + "`, я отправлю тебе весь список в личку. " +
      "\n\n\n **Основная Статистика:**", false);
      embed.addField("Серверов:", bot.guilds.cache.size, true);
      embed.addField("голосовых подключений: ", bot.voice.connections.size, true);
      embed.addField("Пользователей:", bot.users.cache.size, true);
      embed.addField("Каналов:", bot.channels.cache.size, true);
      
      var options = {
          era: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          timezone: 'UTC',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        };
      

      embed.addField("Запущена я была ", bot.startupDate.toLocaleString("ru", options) + "\n\n\n", true);

      embed.addField("Помощь автору проекта", "Помочь автору проекта вы можете задонатив ***[сюда](https://www.donationalerts.com/r/kartonks)***");
      embed.addField("Добавление бота на сервер", "Ссылка на добавление бота на ваш сервер -> [тык](https://discordapp.com/api/oauth2/authorize?client_id=688060877395722338&permissions=8&scope=bot)" +
      "\n\n");
      embed.setFooter("Бот полностью разработан пользователем " + bot.users.cache.get(conf.karton).username + "#" + bot.users.cache.get(conf.karton).discriminator + 
      " при поддержке \"Karton Bots Industries\". Спасибо за внимание!", bot.users.cache.get(conf.karton).avatarURL());
      embed.setThumbnail(bot.user.avatarURL());
      embed.setColor("#ff526c");
      msg.channel.send(embed);
    }
    //#endregion
    
    else
    {
      var embed = new discord.MessageEmbed().setTitle("Main information and help");
      embed.addField("AboutL", "Hi! I'm your personal maid, I can play you music, make you an embed, or show you a funny meme. \n" +
      "To find out all my commands, write `" + conf.prefix + module.exports.commands[0].name[1][0] + "`, I'll send you the entire list as private message " +
      "\n\n\n **Основная Статистика:**", false);
      embed.addField("Server count:", bot.guilds.cache.size, true);
      embed.addField("Voice connections: ", bot.voice.connections.size, true);
      embed.addField("Users count:", bot.users.cache.size, true);
      embed.addField("Channels count:", bot.channels.cache.size, true);
      
      var options = {
          era: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          timezone: 'UTC',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        };
      

      embed.addField("I was started ", bot.startupDate.toLocaleString("en", options) + "\n\n\n", true);

      embed.addField("Developer assistance", "To help the author of the project, you can donate ***[here](https://www.donationalerts.com/r/kartonks)***");
      embed.addField("Add bot to your server", "Link to add a bot to your server -> [tap](https://discordapp.com/api/oauth2/authorize?client_id=688060877395722338&permissions=8&scope=bot)" +
      "\n\n");
      embed.setFooter("A bot by " + bot.users.cache.get(conf.karton).username + "#" + bot.users.cache.get(conf.karton).discriminator + 
      " with the support of \"Karton Bots Industries\".", bot.users.cache.get(conf.karton).avatarURL());
      embed.setThumbnail(bot.user.avatarURL());
      embed.setColor("#ff526c");
      msg.channel.send(embed);
    }
}

var list = [
    {name: [["команды"], ["commands"]], out:commands, ab:["Показывает список команд", "Shows full commands list"]},
    {name: [["модуль"], ["module"]], out:getModule, ab:["Получить оперативную информацию о модуле. (В качестве аргумента укажите название модуля)", 
    "Get information about module"]},
    {name: [["помощь", "хелп", "инфо"], ["help", "info"]], out: Info, ab:["Получить основную помощь по боту", "Get main bot help and statistic"]}
]

module.exports.commands = list;
module.exports.about = {name: [["помощь"], ["helping"]], about:["Иу-Иу-Иу! Первая коммандная помощь уже прибыла!", "Not Translated"]}