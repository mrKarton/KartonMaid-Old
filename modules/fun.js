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
        "https://cdn.fishki.net/upload/post/201503/17/1467388/IR0XSUROobY.jpg",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780529074995240/TPgG8rPzv4Y.png"
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

function getdog(bot, msg, args)
{
    var URLs = [
        "https://media.discordapp.net/attachments/512205598176313354/759779193474121769/OnfW0alti_I.png",
        "https://media.discordapp.net/attachments/512205598176313354/759779232284672010/2TNUSaY55lo.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759779282280382474/W3Z_3owemwM.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759779792387440670/qN7n-7cHES8.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759779847357857792/4Lzn_tA0CDc.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759779956879392768/msGBuJ-YMmI.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759779983542976522/ksCjFHvzmGI.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780129861140510/jtc6H5JIOd8.png",
        "https://sun9-46.userapi.com/c858332/v858332022/1a49c7/iGueSbvvQ1U.jpg",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780218092519474/VyogJS0h-6w.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780389988073502/b5DWZKkf0FE.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780409294323722/PSC9kxSrPKc.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780641968750632/vSWU8j2OLow.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780658108432435/0Bb6ixpepNs.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780676098195507/S_WlWdqTAx0.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780700353593364/8sV2Jjz-2Js.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780796377989170/XhtOL382_mg.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780870914572288/NIk1l_VeDiI.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759780909003702324/63KS_Qe2C5k.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781029254397952/tFPMFdmMVjI.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781213245538334/Y84pq3FS3K8.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781240915886140/XpNCoF4Wsdk.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781267033292800/ay27sXiKHs.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781392098787348/GYUp1p3D0P4.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781461334163497/Y-Ph9SpVe9Y.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781739417174077/OJduvJn7mdY.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781758999855134/fH9BUZ9Jlhs.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781836699336735/7ZksTTj6v7Y.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781978672594964/kP6HQlllWi0.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782394986233876/KNbKztKhMFk.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782427337424896/FImHIuL8w7w.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782481804394527/vkjS0q7PAfM.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782559948603422/RUxwlefqtJ0.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782632677703712/skOmyiIhmuc.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782701489848350/nasOMHmtSIk.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782832226304010/lnUo1djdQAU.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782873938788352/W-svYt1A4r0.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759782971720073226/0NZE2FzPkRI.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759783020722257950/EyCW0myzkXc.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759783140964564993/KHL00mLC-2A.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759783183465447495/SMXMfLMDcOE.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759781579030921216/lKl_Zy4r-c.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759779643497775124/77l4ml7Uqf8.png",
        "https://cdn.discordapp.com/attachments/512205598176313354/759779926818684938/YZ0jlAOYDQE.png"
    ];

    var ru = require('../configurations/fun-ru.json');
    var en = require('../configurations/fun-en.json');
    var lang = ru;
    if(guildF.getLang(msg.guild.id) != 'rus')
    {
        lang = en;
    }

    var URL = URLs[funcs.getRandomInt(0, URLs.length)];

    

    var Phrase = lang.dog.phrases[funcs.getRandomInt(0, lang.dog.phrases.length)];


    var Head = lang.dog.heads[funcs.getRandomInt(0, lang.dog.heads.length)]

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
    {name:[["собака", "собаня"], ["dog", "doggy"]], out:getdog, ab:["КА ЖИ Я ЛЮБЛЮ СОБАНЕЙ!! Вот и вам парочка... На.. Ешб", "Oh! they are so f\*\*\*ng cute! Get one peace!"]},
    {name: [["мем"], ["meme"]], out:meme, ab:["Мемы мои мемы, получите дозу счастья с помощью этой команды!", "Meme review! Take your portion of memes"]},
    {name: [["emoji"], ["emoji"]], out:emojis, ab: ["Превратите свой \"*просто_текст*\" в не просто текст, а в эмоджи!","turn your plain text to.. **Not plain** *EmoJieS*!"]}
];

module.exports.commands = list;
module.exports.about = {name:[["развелечния", "фан"], ["fun"]], about: ["О мемы, мемы.. и коалы.. И много всякой другой весёлой фигни в этом модуле!", 
"There are so many funny things in this module. Enjoy "]};