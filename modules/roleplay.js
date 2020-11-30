var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var dataRus = require('../configurations/roleplay-ru.json');
var dataEn = require('../configurations/roleplay-en.json');
var colors = require('../configurations/colors.json');
var guildF = require('../GuildConfigs/functions');
const request = require('request');
function kick(bot, msg, args)
{
    RP(bot,msg,args,"kick");
}

function kiss(bot,msg,args)
{
    RP(bot,msg,args,"kiss");
}

function kill(bot,msg,args)
{
    RP(bot,msg,args,"kill");
}

function hug(bot,msg,args)
{
    RP(bot,msg,args,"hug");
}

function ban(bot, msg, args)
{
    RP(bot,msg,args,"ban");
}

function fuck(bot, msg, args)
{
    RP(bot,msg,args,"fuck");
}

function gift(bot, msg, args)
{
    RP(bot,msg,args,"gift");
}

function RP(bot, msg, args, type)
{

    var ru = require('../configurations/roleplay-ru.json');
    var en = require('../configurations/roleplay-en.json');
    var lang = ru;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "en")
    {
        lang = en;
        langID = 1;
    }
    var color_data = colors.roleplay;
    var color = color_data.kick;
    var dat;
    var tennorQuery;
    switch(type)
    {
        case "kick":
            tennorQuery = "hit";
            color = color_data.kick;
            dat = lang.kick;
            console.log("1212");
        break;

        case "kiss":
            tennorQuery = "kiss"
            dat = lang.kiss;
            color = color_data.kiss;
        break;

        case "kill":
            tennorQuery = "kill"
            color = color_data.kill;
            dat = lang.kill;
        break;

        case "hug":
            tennorQuery = "hug"
            color = color_data.hug;
            dat = lang.hug;
        break;

        case "ban":
            tennorQuery = "banhammer"
            color = color_data.ban;
            dat = lang.ban;
        break;

        case "fuck":
            tennorQuery = "fucking"
            color = color_data.fuck;
            dat = lang.fuck;
        break;

        case "gift":
            tennorQuery = "gift"
            color = color_data.gift;
            dat = lang.gift;
        break;
    }

    request('http://194.58.122.151:7777/Tennor?find=' + tennorQuery, (req, res, body)=>{
        if(body != '404')
        {
            var gifURL = "";
            var startsIn = body.indexOf('src="');
            // console
            for(var i = startsIn + 13; i < body.length; i++)
            {
                if(body[i] == '"')
                {
                    break;
                }
                gifURL += body[i];
            }
            // console.log(gifURL);

            if(type == 'fuck')
            {
                gifURL = dat.gif[funcs.getRandomInt(0, dat.gif.length)];
            }
            var embed = new discord.MessageEmbed().setColor(color)
            .setTitle(dat.title[funcs.getRandomInt(0, dat.title.length)])
            .setDescription("<@" + msg.author.id + "> " + dat.phrase[funcs.getRandomInt(0, dat.phrase.length)] + " " +
            msg.content.split(" ")[1]).setImage(gifURL);

            if(args.length > 1)
            {
                var wWords = "Со словами"
                if(lang == dataEn)
                {
                    wWords = "Talking:"
                }
                embed.addField(wWords, funcs.getStrValuesAfter(1, args) );
            }

            msg.channel.send(embed);
            msg.delete();
        }
    });

    
}

module.exports.commands = [
    {name: [["ударить", "уебать", "пнуть", "ударил"], ["punch", "beat"]], out:kick, ab:["Чувак, ты это заслужил!", "Huh, dude, you deserved it.."]},
    {name: [["цем", "поцеловать","поцеловал"],["kiss"]], out:kiss, ab:["Поцелуйте своего любимого человека..", "Make love, no war! Kiss your lover"]},
    {name: [["убить", "убил"], ["kill", "murder"]], out:kill, ab:["Совершите ужасное убийство кого-то с помощью этой команды", "Make a one more dead, you bastard killer"]},
    {name: [["обнять", "обнял"], ["hug"]], out:hug, ab:["Обнимашки!", "Oh! Come to me, I'll give you a hug"]},
    {name: [["забанить", "бан"], ["ban"]], out:ban, ab:["Как же ты задолбал.. Бан в ЖБАН!", "Oh, you're so deliverable, take a ban!"]},
    {name: [["выебать", "засексить"], ["fuck"]], out:fuck, ab:["О да, иди ко мне.. (18+)", "||censored||"]},
    {name: [["подарок", "подарить"], ["gift", "give"]], out:gift, ab:["От серца и почек дарю тебе цветочек", "Here's your gift!"]}
];

module.exports.module = {name:[["ролеплей", "рп", "странные-гифки"], ["roleplay", "rp"]], about:["РП команды на \\Почти все\\ случаи жизни: от поцелуев до секоса, от ударов до убийства \n (Гифки взяты с **[Тенора](https://tenor.com)**)", 
"Bring a colors into your chatting! Roleplay commands, thanks to which you can easily portray your action ;)\n(Gifs are from **[Tenor](https://tenor.com)**)"]}