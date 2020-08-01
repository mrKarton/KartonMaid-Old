const discord = require('discord.js');  //
const bot = new discord.Client();       // connecting to discord
const config = require('./conf.json');  // loading configuration from conf.json

var commands = require('./moduler.js').commands;

bot.on('ready', ()=> {
    console.log('Bot is ready to use.');// when bot is ready, message it
    bot.generateInvite(["ADMINISTRATOR"]).then((link)=>{console.log("My link: " + link)});//when invition link created, messgae it
});

bot.login(config.token); //logining with token from config

bot.on('message', (message)=>{


    if(message.content.startsWith(config.prefix) && message.author.id != bot.user.id); 
    {
        var args = splitForBot(message.content);
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

function splitForBot(content)
{
    if(typeof(content) == typeof("String")) //Checking for type of content (we need a string)
    {
        var step1 = content.split(config.prefix);//spliting prefix
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