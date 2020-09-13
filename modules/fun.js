var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var colors = require('../configurations/colors.json');
var guildF = require('../GuildConfigs/functions');

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

    var ru = require('../configurations/fun-ru.json');
    var en = require('../configurations/fun-en.json');
    var lang = ru;
    if(guildF.getLang(msg.guild.id) != 'rus')
    {
        lang = en;
    }

    var URL = URLs[funcs.getRandomInt(0, URLs.length)];

    

    var Phrase = lang.koala.phrases[funcs.getRandomInt(0, lang.koala.phrases.length)];


    var Head = lang.koala.heads[funcs.getRandomInt(0, lang.koala.heads.length)]

    var em = new discord.MessageEmbed().setTitle(Head).setFooter(Phrase).setImage(URL).setColor(colors.fun);

    msg.channel.send(em);
}

function meme(bot, msg, args)
{
    var ru = require('../configurations/fun-ru.json');
    var en = require('../configurations/fun-en.json');
    var lang = ru;
    if(guildF.getLang(msg.guild.id) != 'rus')
    {
        lang = en;
    }

    var request = require('request');

    var URL = 'https://meme-api.herokuapp.com/gimme';
                    
    request(URL, function (err, res, body) 
    {
        var Data = JSON.parse(body);
        
        var Head = lang.meme.phrases[funcs.getRandomInt(0, lang.meme.phrases.length)];
                
        var em = new discord.MessageEmbed().setImage(Data.url)
        .setURL(Data.postLink)
        .setAuthor(Data.subreddit, "https://i.pinimg.com/736x/db/a1/39/dba13992aa33c33e549c4ef9fbb7effe.jpg")
        .setTitle(Data.title).setColor(colors.fun).setFooter(Head);

        msg.channel.send(em);
    });
}

function emojis(bot, msg, args)
{
    var numbers = ["1","2","3","4","5","6","7","8","9","0"];
    var numbers_str = ["one","two","three","four","five","six","seven","eight","nine","zero"];
    let symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var targ = funcs.getStrValuesAfter(0, args).toLowerCase();
    var targ = funcs.translit(targ);
    var finalString = "";
    for(let symb in targ)
    {
        var symbol = targ[symb];
        if(numbers.indexOf(symbol) != -1)
        {
            finalString += ":" + numbers_str[numbers.indexOf(symbol)] + ":";
        }
        if(symbols.indexOf(symbol) != -1)
        {
            finalString += ":regional_indicator_" + symbol + ":"; 
        }
        if(symbol == " ")
        {
            finalString += ' ';
        }
    }
    msg.channel.send(new discord.MessageEmbed().setDescription(finalString).setFooter(msg.author.username, msg.author.avatarURL()).setColor(colors.info));
}

var list = [
    {name: [["эмбед"], ["embed"]], out:MakeEmbed, ab:["(***Только для админов***) \n Создаёт Эмбед-сообщение. \n Синтаксис: `[#channel] [#color-HEX] [title] [other text]`", 
    "Create a *BeaUtIfulL* embed-messge. Command syntax: `[#channel] [#color-HEX] [title] [other text]`"],
    requedPremissons:["ADMINISTRATOR"]},
    {name: [["коала"], ["koala"]], out:getCoala,ab:["Даёт вам лицезреть лучшее существо на планете!", 
    "Awww, is this KOALA?? I wanna more pictures with this cute creations.. ||Seriously, send me more photos in DM||"]},
    {name: [["мем"], ["meme"]], out:meme, ab:["Мемы мои мемы, получите дозу счастья с помощью этой команды!", "Meme review! Take your portion of memes"]},
    {name: [["emoji"], ["emoji"]], out:emojis, ab: ["Превратите свой \"*просто_текст*\" в не просто текст, а в эмоджи!","turn your plain text to.. **Not plain** *EmoJieS*!"]}
];

module.exports.commands = list;
module.exports.about = {name:[["развелечния", "фан"], ["fun"]], about: ["О мемы, мемы.. и коалы.. И много всякой другой весёлой фигни в этом модуле!", 
"There are so many funny things in this module. Enjoy "]};