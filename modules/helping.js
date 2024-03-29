var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var moduler = require('../moduler.js');

var colors = require('../configurations/colors.json');

var guildF = require('../GuildConfigs/functions');

function commands(bot, msg, args)
{
  var ru = require('../localisation/rus/helping.json');
  var en = require('../localisation/en/helping.json');
  var lang = ru;
  var langID = 0;

  if(guildF.get(msg.guild.id).Language == "en")
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
            allComands += "`" + guildF.get(msg.guild.id).Prefix + mod.commands[j].name[langID][0] + "` - " + mod.commands[j].ab[langID] + ", \n";
            // console.log(mod);
            if(typeof mod.commands[i].requedPremissons != "undefined")
            {
              allComands += "***" + lang.commands.Premissions + ":*** \n";

                mod.commands[i].requedPremissons.forEach((entr)=>{
                  allComands += "`" + entr + "` \n";
                });
              
            }
            
            allComands+= "\n";
        }

        em.addField(mod.module.name[langID][0], allComands, inline);
    }

    msg.author.send(em);
    msg.channel.send(new discord.MessageEmbed().setColor(colors.info).setDescription("<@" + msg.author.id + ">," + lang.commands.Body));
}

function getModule(bot, msg, args)
{
  var ru = require('../localisation/rus/helping.json');
  var en = require('../localisation/en/helping.json');
  var lang = ru;
  var langID = 0;

  if(guildF.get(msg.guild.id).Language == "en")
  {
      lang = en;
      langID = 1;
  }

    for(var i =0; i < moduler.modules.length; i++)
    {
        if(moduler.modules[i].module.name[langID].indexOf(args[0]) != -1)
        {
            var mod = moduler.modules[i];
            var embed = new discord.MessageEmbed().setColor(colors.info)
            .setTitle(lang.module.title + "\"" + mod.module.name[langID][0] + "\"")
            .setDescription(mod.module.about[langID]);

            var cmdStr = "";
            for(var i =0; i < mod.commands.length; i++)
            {
              // console.log(mod.commands[i]);
                cmdStr += "`" +  guildF.get(msg.guild.id).Prefix + mod.commands[i].name[langID][0] + "` - " + mod.commands[i].ab[langID] + ". \n";
                
                if(typeof mod.commands[i].requedPremissons != "undefined")
                {
                  cmdStr += "***" + lang.commands.Premissions + ":*** \n";
                  mod.commands[i].requedPremissons.forEach((entr)=>{
                    cmdStr += "`" + entr + "` \n";

                  })
                  
                }
                cmdStr+="\n\n";
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
  var ru = require('../localisation/rus/helping.json');
  var en = require('../localisation/en/helping.json');
    var lang = ru;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "en")
    {
        lang = en;
        langID = 1;
    }
  //#region rus
    if(langID == 0)
    {
      var embed = new discord.MessageEmbed().setTitle("Основная информация и помощь");
      embed.addField("О боте:", "Привет! Я твоя персональная горничная, я могу включить тебе музыку, сделаю для тебя эмбед, или покажу тебе смешной мем. \n" +
      "Для того, что бы узнать все мои команды, напиши `" + conf.prefix + module.exports.commands[0].name[0][0] + "`, я отправлю тебе весь список в личку. " +
      "\n\n\n **Основная Статистика:**", false);
      embed.addField("Серверов:", bot.guilds.cache.size, true);
      embed.addField("голосовых подключений: ", bot.voice.connections.size, true);
      embed.addField("Пользователей:", bot.users.cache.size, true);
      embed.addField("Каналов:", bot.channels.cache.size, true);
      console.log(bot.users.cache.keyArray());
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

      embed.addField("Помощь автору проекта", "Вы можете **[задонатить](https://www.donationalerts.com/r/kartonks)** мне на Donation Alerts ([link](https://www.donationalerts.com/r/kartonks))");
      embed.addField("Добавление бота на сервер", "[Ссылка на добавление бота на ваш сервер](https://discordapp.com/api/oauth2/authorize?client_id=688060877395722338&permissions=8&scope=bot)" +
      "\n\n");
      embed.setFooter("© " + bot.users.cache.get(conf.karton).username + " • 2020 • mrkarton.ru", bot.users.cache.get(conf.karton).avatarURL());
      embed.setThumbnail(bot.user.avatarURL());
      embed.setColor(colors.info);
      msg.channel.send(embed);
    }
    //#endregion
    
    else
    {
      var embed = new discord.MessageEmbed().setTitle("Main information and help");
      embed.addField("About:", "Hi! I'm your personal maid, I can play you music, make you an embed, or show you a funny meme. \n" +
      "To find out all my commands, write `" + conf.prefix + module.exports.commands[0].name[1][0] + "`, I'll send you the entire list as private message " +
      "\n\n\n **Main statistic:**", false);
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

      embed.addField("Developer assistance", "To help the author of the project, you can ***[DONATE](https://www.donationalerts.com/r/kartonks)***");
      embed.addField("Add bot to your server", "[Link to add a bot to your server](https://discordapp.com/api/oauth2/authorize?client_id=688060877395722338&permissions=8&scope=bot)" +
      "\n\n");
      embed.setFooter("© " + bot.users.cache.get(conf.karton).username + " • 2020 • mrkarton.ru", bot.users.cache.get(conf.karton).avatarURL());
      embed.setThumbnail(bot.user.avatarURL());
      embed.setColor(colors.info);
      msg.channel.send(embed);
    }
}

function dev(bot, msg, args)
{
  var version = require('../version.json');

  var ru = require('../localisation/rus/helping.json');
    var en = require('../localisation/en/helping.json');
    var lang = ru;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "en")
    {
        lang = en;
        langID = 1;
    }

  if(langID == 0)
  {
    var embed = new discord.MessageEmbed().setTitle("Информация о разработке");
    embed.setColor(colors.info);
    embed.setDescription("Информация о разработке бота и о том, как вы можете мне помочь.");
    embed.setThumbnail(bot.user.avatarURL());
    embed.addField("Баг репорт:", "Вы можете отпавить сведения о найденом баге с помощью команды `" 
    + guildF.get(msg.guild.id).Prefix + "репорт`. (Команда доступна только серверным администраторам во избежание спама)");
    embed.addField("Информация о версии:", "Основная инфа.")
    embed.addField("Версия:", version.version, true);
    embed.addField("Перевод на английский:", version.localistion + "%", true);
    embed.addField("Список изменений:", version.changelog, true);

    if(version.dev)
    {
      embed.addField("Внимание!", "Это нестабильная версия бота.");
    }

    embed.addField("Помощь разработчику:", "[Донат](https://www.donationalerts.com/r/kartonks)" +  
    "\n **Связь с разработчиком:** \n [Email](https://gornostaev.dmitry04@gmail.com) \n [Telegram](https://telegram.me/mrKarton) \n [GitHub](https://github.com/mrKarton) ");

    if(!version.dev)
    {
      embed.addField("Отдельное спасибо за помощь в разработке:", funcs.getHelpers(bot));
    }

    embed.setFooter("© " + bot.users.cache.get(conf.karton).username + " • 2020 • mrkarton.ru", bot.users.cache.get(conf.karton).avatarURL());

    msg.channel.send(embed);
  }

  else
  {
    var embed = new discord.MessageEmbed().setTitle("Developing information");
    embed.setColor(colors.info);
    embed.setDescription("Information on the development of the bot and how you can help me.");
    embed.setThumbnail(bot.user.avatarURL());
    embed.addField("Bug report:", "You can send information about a found bug using the command `" 
    +  guildF.get(msg.guild.id).Prefix + "report`. (This command is only available to server administrators to avoid spam)");
    embed.addField("Version information:", "Basic info")
    embed.addField("Version:", version.version, true);
    embed.addField("English translation:", version.localistion + "%", true);
    embed.addField("Changelog:", version.changelog, true);

    if(version.dev)
    {
      embed.addField("!CAUTION!", "This is instabile version.");
    }

    embed.addField("Developer assistance:", "You can help me with \n **-[Donate](https://www.donationalerts.com/r/kartonks)**" + 
    "\n **Contact the developer** \n [Email](https://gornostaev.dmitry04@gmail.com) \n [Telegram](https://telegram.me/mrKarton) \n [GitHub](https://github.com/mrKarton) ");

    if(!version.dev)
    {
      embed.addField("Special thanks for:", funcs.getHelpers(bot));
    }

    embed.setFooter("© " + bot.users.cache.get(conf.karton).username + " • 2020 • mrkarton.ru", bot.users.cache.get(conf.karton).avatarURL());

    msg.channel.send(embed);
  }
}

var list = [
    {name: [["команды"], ["commands"]], out:commands, ab:["Показывает список команд", "Shows full commands list"]},
    {name: [["модуль"], ["module"]], out:getModule, ab:["Получить оперативную информацию о модуле. (В качестве аргумента укажите название модуля)", 
    "Get information about module"]},
    {name: [["помощь", "хелп", "инфо"], ["help", "info"]], out: Info, ab:["Получить основную помощь по боту", "Get main bot help and statistic"]},
    {name:[["разраб", "разработка"], ["dev", "developing"]], out:dev, ab:["Узнать о версии бота и о том, как можно помочь разработчику", 
    "Find out about the bot version and how you can help the developer"]}
]

module.exports.commands = list;
module.exports.about = {name: [["помощь"], ["helping"]], about:["Иу-Иу-Иу! Первая коммандная помощь уже прибыла!", "Not Translated"]}