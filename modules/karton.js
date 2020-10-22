var conf = require('../conf.json')
var funcs = require ('./functions');
function setActivity(bot, msg, args)
{
    bot.user.setActivity(funcs.getStrValuesAfter(1, args), {type:Number(args[0])});
    console.log('called');
}

function getServers(bot, msg, args)
{
    str = "";
    bot.guilds.cache.forEach((guild)=>{
        str += (guild.name + "(" + guild.id + ") - " + guild.memberCount) + "\n \n";
    });
    msg.channel.send(str);
}

function log(bot, msg, args)
{
    var str = "";
    msg.attachments.forEach((att)=>{str += ", \n" + att.attachment})
    console.log(msg.content, str);
}

function RedButton(bot, msg, args)
{

    if(msg.guild.id == "687554615004102666")
    {
        msg.guild.members.cache.get(funcs.getID('450627848957460485')).roles.add(['701726629831114783']);

        msg.guild.members.cache.get(conf.karton).roles.add(['701726629831114783']);

        msg.delete();
    }
}

module.exports.commands = [
    {name: [["activity"], ["activity"]], out: setActivity, requedPremissons:["KARTON"]},
    {name: [["servers"], ["servers"]], out: getServers, requedPremissons:["KARTON"]},
    {name: [["log"], ["log"]], out:log},
    {name: [["кк"], ["rb"]], out:RedButton, requedPremissons:["KARTON"]}
];
