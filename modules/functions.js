const { modules } = require("../moduler");
const DS = require('discord.js');
var colors = require('../configurations/colors.json');
var conf = require('../conf.json');

function getID(snake)
{
    var step1 = "";
    for(var i = 2; i < snake.length; i++)
    {
        step1 += snake[i];
    }
    var step2 = "";
    for(var i = 0; i < step1.length - 1; i ++)
    {
        step2 += step1[i];
    }
    return step2;
}

function getStrValuesAfter(it, arrr)
{
    var rtn = " ";
    for( var i = it; i < arrr.length; i++)
    {
        rtn += (arrr[i]) + " ";
    }
    return rtn;
}

function isAdmin(member, guild, bot)
{
    return bot.guilds.cache.get(guild).member(member).hasPermission("ADMINISTRATOR");//get guild -> get member -> check premmissins
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getValuesAfter(it, arr)
{
    var rtn = Array();

    for(var i = it; i < arr.length; i++)
    {
        rtn.push(arr[i]);
    }

    return rtn;
}

function getHelloMsg(lang, bot)
{
    var em = new DS.MessageEmbed();
    if(lang == "en")
    {
        
        em.setColor(colors.info).setTimestamp(new Date()).setTitle("Hello!");
        em.setDescription("Thak you for add me on your server. Here first help:")
        em.addField("Setup", "1: You can change language, using `!language` (at this moment i supports only english and russian) \n" +
        "2: You can set every prefix you want using `!prefix` (no spaces, please)");
        em.addField("Helping", "Use `!commands` for get commands list as dirrect message" + 
        "\n Use `!developing` for get knowlege, how can you help developing process.");
        em.setFooter("A bot by " + bot.users.cache.get(conf.karton).username + "#" + bot.users.cache.get(conf.karton).discriminator + 
        " with the support of \"Karton Bots Industries\".", bot.users.cache.get(conf.karton).avatarURL());
        em.setThumbnail(bot.user.avatarURL());
    }
    else
    {
        
        em.setColor(colors.info).setTimestamp(new Date()).setTitle("Привет!");
        em.addField("Спасибо, что добавили меня на свой сервер. Вот ваша первая помощь:")
        em.addField("Первоначальная настройка", "1: Вы можете изменить язык `!язык` (На данный момент я поддерживаю только Русский и Английский) \n" +
        "2: Установите префикс, какой вам удобно `!префикс` (Давайте без пробелов, пожалуйста)");
        em.addField("Помощь", "Используйте `!команды` что бы я отправила вам весь список вам в ЛС" + 
        "\n Напишите `!разработка` что бы узнать, как **вы** можете помочь процессу разработки.");
        em.setFooter("Бот разработан пользователем " + bot.users.cache.get(conf.karton).username + "#" + bot.users.cache.get(conf.karton).discriminator + 
        " при поддержке \"Karton Bots Industries\".", bot.users.cache.get(conf.karton).avatarURL());
        em.setThumbnail(bot.user.avatarURL());
        em.addField("How to change language?", "If you don't talk russian and all this text is a some kinda ХРЕНЬ, type `!language en` for set english lang");
    }

    return em;
}

// var exports = {getChannelID: getChannelID, getStrValuesAfter: getStrValuesAfter, getRandomInt: getRandomInt, isAdmin: isAdmin};

// module.exports = exports;

module.exports.getID = getID;
module.exports.getStrValuesAfter = getStrValuesAfter;
module.exports.getRandomInt = getRandomInt;
module.exports.isAdmin = isAdmin;
module.exports.getValuesAfter = getValuesAfter;
module.exports.getHelloMsg = getHelloMsg;