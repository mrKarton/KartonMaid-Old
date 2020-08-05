var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var dataRus = require('../configurations/roleplay-ru.json');
var colors = require('../configurations/colors.json');

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

function RP(bot, msg, args, type)
{
    var color_data = colors.roleplay;
    var color = color_data.kick;
    var dat;
    switch(type)
    {
        case "kick":
            color = color_data.kick;
            dat = dataRus.kick;
            console.log("1212");
        break;

        case "kiss":
            dat = dataRus.kiss;
            color = color_data.kiss;
        break;

        case "kill":
            color = color_data.kill;
            dat = dataRus.kill;
        break;

        case "hug":
            color = color_data.hug;
            dat = dataRus.hug;
        break;

    }
    console.log(dat);
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
    {name: [["ударить", "уебать", "пнуть", "ударил"], ["hit"]], out:kick, about:["Чувак, ты это заслужил!", "Not translated"]},
    {name: [["цем", "поцеловать","поцеловал"],["kiss"]], out:kiss, about:["Поцелуйте своего любимого человека..", "Not translated"]},
    {name: [["убить", "убил"], ["kill"]], out:kill, about:["Совершите ужасное убийство кого-то с помощью этой команды", "Not translated"]},
    {name: [["обнять", "обнял"], ["hug"]], out:hug, about:["Обнимашки!", "Not translated"]}
];

module.exports.module = {name:[["РП", "Ролеплей"], ["Roleplay", "RP"]], about:["**!Модуль в активной разработке!**", "***!module not translated!***"]}