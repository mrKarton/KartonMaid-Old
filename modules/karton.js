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

module.exports.commands = [
    {name: [["activity"], ["activity"]], out: setActivity, requedPremissons:["KARTON"]},
    {name: [["servers"], ["servers"]], out: getServers, requedPremissons:["KARTON"]},
    {name: [["log"], ["log"]], out:log, requedPremissons:["KARTON"]}
];
