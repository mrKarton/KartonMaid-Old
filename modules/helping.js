var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var moduler = require('../moduler.js');

function commands(bot, msg, args)
{

    var allComands = " ";
    for(var i = 0; i < moduler.commands.length; i++)
    {
        allComands += "` " + conf.prefix + moduler.commands[i].name[0] + "` - " + moduler.commands[i].ab + "\n\n";
    }

    var em = new discord.MessageEmbed().setTitle("Комманды бота").setColor("#ff2b2b")
    .setDescription(allComands);

    msg.channel.send(em);
}

function modules(bot, msg, atgs)
{
    console.log(moduler.modules);
}

var list = [
    {name: ["команды"], out:commands, ab:"Показывает список команд"},
    {name: ["модули"], out:modules}
]

module.exports.commands = list;