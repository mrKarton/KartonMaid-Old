var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var dataRus = require('../configurations/roleplay-ru.json');
var dataEn = require('../configurations/roleplay-en.json');
var colors = require('../configurations/colors.json');
var guildF = require('../GuildConfigs/functions');
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
    var lang = dataRus;
    var langID = 0;

    if(guildF.getLang(msg.guild.id) == 'rus')
    {
      lang = dataRus;
    }
    else
    {
      lang = dataEn;
      langID = 1;
    }
    var color_data = colors.roleplay;
    var color = color_data.kick;
    var dat;
    switch(type)
    {
        case "kick":
            color = color_data.kick;
            dat = lang.kick;
            console.log("1212");
        break;

        case "kiss":
            dat = lang.kiss;
            color = color_data.kiss;
        break;

        case "kill":
            color = color_data.kill;
            dat = lang.kill;
        break;

        case "hug":
            color = color_data.hug;
            dat = lang.hug;
        break;

        case "ban":
            color = color_data.ban;
            dat = lang.ban;
        break;

        case "fuck":
            color = color_data.fuck;
            dat = lang.fuck;
        break;

        case "gift":
            color = color_data.gift;
            dat = lang.gift;
        break;

    }
    var embed = new discord.MessageEmbed().setColor(color)
    .setTitle(dat.title[funcs.getRandomInt(0, dat.title.length)])
    .setDescription("<@" + msg.author.id + "> " + dat.phrase[funcs.getRandomInt(0, dat.phrase.length)] + " " +
     msg.content.split(" ")[1]).setImage(dat.gif[funcs.getRandomInt(0, dat.gif.length)]);

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
}

module.exports.commands = [
    {name: [["ударить", "уебать", "пнуть", "ударил"], ["punch", "beat"]], out:kick, about:["Чувак, ты это заслужил!", "Huh, dude, you deserved it.."]},
    {name: [["цем", "поцеловать","поцеловал"],["kiss"]], out:kiss, about:["Поцелуйте своего любимого человека..", "Make love, no war! Kiss your lover"]},
    {name: [["убить", "убил"], ["kill", "murder"]], out:kill, about:["Совершите ужасное убийство кого-то с помощью этой команды", "Make a one more dead, you bastard killer"]},
    {name: [["обнять", "обнял"], ["hug"]], out:hug, about:["Обнимашки!", "Oh! Come to me, I'll give you a hug"]},
    {name: [["забанить", "бан"], ["ban"]], out:ban, about:["Как же ты задолбал.. Бан в ЖБАН!", "Oh, you're so deliverable, take a ban!"]},
    {name: [["выебать", "засексить"], ["fuck"]], out:fuck, about:["О да, иди ко мне.. (18+)", "||censored||"]},
    {name: [["подарок", "подарить"], ["gift", "give"]], out:gift, about:["От серца и почек дарю тебе цветочек", "Here's your gift!"]}
];

module.exports.module = {name:[["Ролеплей", "РП"], ["Roleplay", "RP"]], about:["**!Модуль в активной разработке!**", "***!module not translated!***"]}