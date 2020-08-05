var conf = require('../conf.json')

function log(bot, msg, args)
{
    if(msg.author.id == conf.karton)
    {
        console.log(msg.content);
    }
}

function Test(bot, msg, args)
{
    if(msg.author.id == conf.karton)
    {
        require('../GuildConfigs/688755946624647238.json').language = "en";
    }
}

function Servs(bot, msg,args)
{
    if(msg.author.id == conf.karton)
    {
        var str = " ";
        var keys = bot.guilds.cache.keyArray();
        for(var i = 0; i < keys.length; i++)
        {
            str += bot.guilds.cache.get(keys[i]).id + " - " + bot.guilds.cache.get(keys[i]).name + "\n";
        }
        msg.reply(str);
        console.log(str);
    }
}

function Region(bot,msg,args)
{
    msg.reply(msg.guild.region);
}

module.exports.commands = [
    {name: [["log"], ["log"]], out: log},
    {name: [["test"], ["log"]], out:Test},
    {name: [["servs"], ["log"]], out:Servs},
    {name: [["region"], ["region"]], out:Region}
];
