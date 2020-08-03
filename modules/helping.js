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

function Info(bot, msg, args)
{
    var embed = new discord.MessageEmbed().setTitle("Основная информация и помощь");
    embed.addField("О боте:", "Привет! Я твоя персональная горничная, я могу включить тебе музыку, сделаю для тебя эмбед, или покажу тебе смешной мем. \n" +
    "Для того, что бы узнать все мои команды, напиши `" + conf.prefix + module.exports.commands[0].name[0] + "`, я отправлю тебе весь список в личку. " +
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
    embed.setFooter("Бот полностью разработан пользователем" + bot.users.cache.get(conf.karton).username + "#" + bot.users.cache.get(conf.karton).discriminator + 
    " при поддержке \"Karton Bots Industries\". Спасибо за внимание!", bot.users.cache.get(conf.karton).avatarURL());
    embed.setThumbnail(bot.user.avatarURL());
    embed.setColor("#ff526c");
    msg.channel.send(embed);
}

var list = [
    {name: ["команды"], out:commands, ab:"Показывает список команд"},
    {name: ["модуль", "module"], out:getModule, ab:"Получить оперативную информацию о модуле. (В качестве аргумента укажите название модуля)"},
    {name: ["помощь", "help", "хелп", "инфо", "info"], out: Info}
]

module.exports.commands = list;
module.exports.about = {name: ["помощь"], about:"Иу-Иу-Иу! Первая коммандная помощь уже прибыла!"}