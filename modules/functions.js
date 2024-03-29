const { modules } = require("../moduler");
const DS = require('discord.js');
var colors = require('../configurations/colors.json');
var conf = require('../conf.json');

function getID(snake)
{
    if(snake[0] == '<' && snake[snake.length - 1] == '>')
    {
        var numbers = ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'];

        var startFrom = 2;
        if(snake[2] == '!' || snake[2] == '&')
        {
            startFrom = 3;
        }
        var step1 = "";
        for(var i = startFrom; i < snake.length; i++)
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
    else
    {
        return snake;
    }
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


var transliterate = (
	function() {
		var
			rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
			eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
		;
		return function(text, engToRus) {
			var x;
			for(x = 0; x < rus.length; x++) {
				text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
				text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());	
			}
			return text;
		}
	}
)();
function getHelpers(bot)
{
    var str = "";
    for(var i in conf.helpers)
    {
        var acc = bot.users.cache.get(conf.helpers[i]);
        str += acc.username + "#" + acc.discriminator + "\n";
    }
    return str;
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
        em.setFooter("© " + bot.users.cache.get(conf.karton).username + " • 2020 • mrkarton.ru", bot.users.cache.get(conf.karton).avatarURL());
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
        em.setFooter("© " + bot.users.cache.get(conf.karton).username + " • 2020 • mrkarton.ru", bot.users.cache.get(conf.karton).avatarURL());
        em.setThumbnail(bot.user.avatarURL());
        em.addField("How to change language?", "If you don't talk russian, type `!language en` for set english lang");
    }

    return em;
}

function GetString(array)
{
    var str = "";

    array.forEach((elem)=>{
        str+=elem;
    })

    return str;
}

// var exports = {getChannelID: getChannelID, getStrValuesAfter: getStrValuesAfter, getRandomInt: getRandomInt, isAdmin: isAdmin};

// module.exports = exports;

function declNum(number, words)
{
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1 ,1 ,1, 2][(number % 10 < 5) ? number % 10 : 5]];
}

module.exports.declNum = declNum;
module.exports.getID = getID;
module.exports.getStrValuesAfter = getStrValuesAfter;
module.exports.getRandomInt = getRandomInt;
module.exports.isAdmin = isAdmin;
module.exports.getValuesAfter = getValuesAfter;
module.exports.getHelloMsg = getHelloMsg;
module.exports.translit = transliterate;
module.exports.getHelpers = getHelpers;
module.exports.GetString = GetString;