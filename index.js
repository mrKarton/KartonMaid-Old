const discord = require('discord.js');  //
const bot = new discord.Client();       // connecting to discord
const config = require('./conf.json');  // loading configuration from conf.json
var fs = require('fs');
var version = require('./version.json');
var guildClass = require('./GuildConfigs/guild-class');

var commands = require('./moduler.js').commands;
var startupDat;

bot.on('ready', ()=> {
    startupDat = new Date();
    bot.startupDate = startupDat;
    console.log(bot.user.username + "#" + bot.user.discriminator + " started");// when bot is ready, message it
    bot.generateInvite(["ADMINISTRATOR"]).then((link)=>{console.log("My link: " + link)});//when invition link created, messgae it
});


if(!version.dev)
{
    bot.login(config.token); //logining with token from config
}
else
{
    bot.login(config.devToken); //logining with dev token
}

bot.on('guildCreate', (guild)=>{
    fs.open('GuildConfigs/guilds' + guild.id + ".json", 'w+', (err, fd)=>{
        if(err) console.log(err);
    });
    var newGC = new guildClass(guild.id, "!", "rus");
    fs.writeFile('GuildConfigs/gulds' + guild.id + ".json", JSON.stringify(newGC), ()=>{});
});



bot.on('message', (message)=>{

    if(message.content.startsWith(require('./GuildConfigs/' + message.guild.id + ".json").prefix)); 
    {
        var args = splitForBot(message.content, require('./GuildConfigs/' + message.guild.id + ".json").prefix);
        if(args != 0)  
        {
            var comm = args[0];

            for(var i = 0; i < commands.length; i ++)
            {
                //console.log(comm + " " + commands[i].name)
                if(commands[i].name.indexOf(comm) != -1)
                {
                    commands[i].out(bot, message, getValuesAfter(1, args));
                    break;
                }
            }
        }
    }                      
});

function splitForBot(content, prefix)
{
    if(typeof(content) == typeof("String")) //Checking for type of content (we need a string)
    {
        var step1 = content.split(prefix);//spliting prefix
        if(step1[1] != null)                     //if there are comands
        {
            var step2 = step1[1].split(" ");     //spliting arguments
            var step3 = step2.filter(element => element != '');//remove empty entries
            return step3; //return
        }
        else
        {
            return 0; //return 0 if error
        }
    }
    else
    {
        return 0;    //return 0 if error
    }
}


function getValuesAfter(it, arr)
{
    var rtn = Array();

    for(var i = it; i < arr.length; i++)
    {
        rtn.push(arr[i]);
    }

    return rtn;
}