var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var colors = require('../configurations/colors.json');

function MakeEmbed(bot, msg, args)
{
    if(funcs.isAdmin(msg.author, msg.guild.id, bot))
    {
        var user = msg.author;
        var em = new discord.MessageEmbed().setColor(args[1]).setTitle(args[2]).setDescription(funcs.getStrValuesAfter(3, args))
        .setAuthor(user.username, user.avatarURL());

        bot.guilds.cache.get(msg.guild.id).channels.cache.get(funcs.getID(args[0])).send(em);
    }
}

function getCoala(bot, msg, args)
{
    var URLs = [
        "https://uznayvse.ru/images/stories2016/uzn_1481216689.jpg",
        "https://i.imgur.com/jvAfbII.jpeg",
        "https://i.imgur.com/WYz8uPA.gif",
        "https://img3.goodfon.ru/wallpaper/nbig/a/cb/koala-sumchatoe-avstraliya-5312.jpg",
        "https://cdn.fishki.net/upload/post/2016/04/29/1936190/1446122581-45.jpg",
        "https://www.1zoom.ru/big2/450/305570-blackangel.jpg",
        "https://cdn.fishki.net/upload/post/201503/17/1467388/IR0XSUROobY.jpg"
    ];

    var URL = URLs[funcs.getRandomInt(0, URLs.length)];

    var Phrases = [
        "UwU",
        "ОЙ А КТО ТУТ МОЯ ХОРОШАЯ БУЛОЧКА??",
        "Зовите Картона, у нас тут просто Няшка-обоняшка!",
        "Вы только взгляните на эту сладкую булочку",
        "AWW"
    ];

    var Phrase = Phrases[funcs.getRandomInt(0, Phrases.length)];

    var Heads = [
        "Вот вам ваша коала..",
        "Это вы заказывали дозу умиления и нежности?",
        "О да, это коала!"
    ];

    var Head = Heads[funcs.getRandomInt(0, Heads.length)]

    var em = new discord.MessageEmbed().setTitle(Head).setFooter(Phrase).setImage(URL).setColor(colors.fun);

    msg.channel.send(em);
}

function meme(bot, msg, args)
{
    msg.channel.send("Подождите пару секунд..");

    var request = require('request');

    var URL = 'https://meme-api.herokuapp.com/gimme';
                    
    request(URL, function (err, res, body) 
    {
        var Data = JSON.parse(body);
        var Heads = [
            "Мемы мои мемы",
            "Хотел пивас а получил МЕМАС",
            "Мой смысл жизни - мемы, мемы",
            "Шутка юмора",
            "Еш"
        ];
        var Head = Heads[funcs.getRandomInt(0, Heads.length)];
                
        var em = new discord.MessageEmbed().setImage(Data.url)
        .setURL(Data.postLink)
        .setAuthor(Data.subreddit, "https://i.pinimg.com/736x/db/a1/39/dba13992aa33c33e549c4ef9fbb7effe.jpg")
        .setTitle(Data.title).setColor(colors.fun).setFooter(Head);

        msg.channel.send(em);
    });
}

var list = [
    {name: [["эмбед"], ["embed"]], out:MakeEmbed, ab:["(***Только для админов***) \n Создаёт Эмбед-сообщение. \n Синтаксис: `[#channel] [title] [other text]`"]},
    {name: [["коала"], ["koala"]], out:getCoala,ab:["Даёт вам лицезреть лучшее существо на планете!"]},
    {name: [["мем"], ["meme"]], out:meme, ab:["Мемы мои мемы, получите дозу счастья с помощью этой команды!"]}
];

module.exports.commands = list;
module.exports.about = {name:[["развелечния", "фан"], ["fun"]], about: ["О мемы, мемы.. и коалы.. И много всякой другой весёлой фигни в этом модуле!", "Not translated"]};