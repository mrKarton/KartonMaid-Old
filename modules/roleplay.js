var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var data = require('../configurations/roleplay.json');

function kick(bot, msg, args)
{
    RP(bot,msg,args,"kill");
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

function RP(bot, msg, args, type)
{
    var dat;
    switch(type)
    {
        case "kick":
            dat = data.kick;
        break;

        case "kiss":
            dat = data.kiss;
        break;

        case "kill":
            dat = data.kill;
        break;

        case "hug":
            dat = data.hug;
        break;

    }

    var embed = new discord.MessageEmbed().setColor("#ffff00")
    .setTitle(dat.title[funcs.getRandomInt(0, dat.title.length)])
    .setDescription("<@" + msg.author.id + "> " + dat.phrase[funcs.getRandomInt(0, dat.phrase.length)] + 
    msg.content.split(" ")[1]).setImage(dat.gif[funcs.getRandomInt(0, dat.gif.length)]);

    if(args.length > 1)
    {
        embed.addField("Со словами:", funcs.getStrValuesAfter(1, args));
    }

    msg.channel.send(embed);
}

module.exports.commands = [
    {name: ["ударить", "уебать", "пнуть"], out:kick, about:"Чувак, ты это заслужил!"},
    {name: ["цем", "поцеловать", "kiss"], out:kiss, about:"Поцелуйте своего любимого человека.."},
    {name: ["убить", "kill"], out:kill, about:"Совершите ужасное убийство кого-то с помощью этой команды"},
    {name: ["обнять", "hug"], out:hug, about:"Обнимашки!"}
];