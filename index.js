const discord = require('discord.js');  //
const bot = new discord.Client();       // connecting to discord
const config = require('./conf.json');  // loading configuration from conf.json
var fs = require('fs');
var version = require('./version.json');
var guildClass = require('./GuildConfigs/guild-class');
var guildF = require('./GuildConfigs/functions');
var commands = require('./moduler.js').commands;
var funcs = require('./modules/functions');
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
    var lang = "en";

    if(guild.region == "russia")
    {
        lang = "rus";
    }

    fs.open('./GuildConfigs/guilds/' + guild.id + ".json", 'w+', (err, fd)=>{
        if(err) console.log(err);
    });
    var newGC = new guildClass(guild.id, "!", lang);
    fs.writeFileSync('./GuildConfigs/guilds/' + guild.id + ".json", JSON.stringify(newGC), (err)=>{console.log(err)});
    console.log(newGC);
    if(guild.systemChannel != null)
    {
        guild.systemChannel.send(funcs.getHelloMsg(newGC.language, bot));
    }
});

bot.on('message', (message)=>{
    
    var LangID = 0;

    if(message.guild != null)
    {
        if(message.author.id != bot.user.id)
        {
            if(guildF.getLang(message.guild.id) == "en")
            {
                LangID = 1;
            }
            

            if(message.content.startsWith(require('./GuildConfigs/guilds/' + message.guild.id + ".json").prefix)); 
            {
                var args = splitForBot(message.content, require('./GuildConfigs/guilds/' + message.guild.id + ".json").prefix);
                if(args != 0)  
                {
                    var comm = args[0];

                    for(var i = 0; i < commands.length; i ++)
                    {
                        // TODO - Я могу сделать поля в объектах комманд для того, что бы оптимизировать объём кода.
                        if(commands[i].name[LangID].indexOf(comm) != -1)
                        {
                            commands[i].out(bot, message, getValuesAfter(1, args));
                            break;
                        }
                    }
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
