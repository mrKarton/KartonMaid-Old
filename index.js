const discord = require('discord.js');  //
const bot = new discord.Client();       // connecting to discord
const config = require('./conf.json');  // loading configuration from conf.json
var fs = require('fs');
var version = require('./version.json');
var guildClass = require('./GuildConfigs/guild-class');
var guildF = require('./GuildConfigs/functions');
var commands = require('./moduler.js').commands;
var funcs = require('./modules/functions');
var colors = require('./configurations/colors.json');
var startupDat;

bot.on('ready', ()=> {
    startupDat = new Date();
    bot.startupDate = startupDat;
    console.log(bot.user.username + "#" + bot.user.discriminator + " started");// when bot is ready, message it
    bot.generateInvite(["ADMINISTRATOR"]).then((link)=>{console.log("My link: " + link)});//when invition link created, messgae it

    var keys = bot.guilds.cache.keyArray();
    for(var i = 0; i < keys.length; i++)
    {
        var gc = require('./GuildConfigs/guilds/' + keys[i] + ".json");
        if(!gc.statEnabled)
        {
            gc.statEnabled = false;
            gc.statChannels = [];
            fs.writeFileSync('./GuildConfigs/guilds/' + keys[i] + ".json", JSON.stringify(gc), (err)=>{console.log(err)});
        }
    }

    bot.user.setPresence({
        status: "online",  //You can show online, idle....
        game: {
            name: "Using !help",  //The message shown
            type: "STREAMING" //PLAYING: WATCHING: LISTENING: STREAMING:
        }
    });
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
            

            if(message.content.startsWith(require('./GuildConfigs/guilds/' + message.guild.id + ".json").prefix))
            {
                var args = splitForBot(message.content, require('./GuildConfigs/guilds/' + message.guild.id + ".json").prefix);
                if(args != 0)  
                {
                    var comm = args[0];

                    for(var i = 0; i < commands.length; i ++)
                    {
                        // TODO - Я могу сделать поля в объектах комманд для того, что бы оптимизировать объём кода.
                        if(commands[i].name[LangID].indexOf(comm.toLowerCase()) != -1)
                        {
                            var command = commands[i];
                            var reqP = command.requedPremissons;
                            if(typeof reqP != "undefined")
                            {
                                var premissionsEqualas = 0;
                                reqP.forEach((entr)=>{
                                    if(entr == "KARTON")
                                    {
                                        if(message.author.id == config.karton)
                                        {
                                            premissionsEqualas = reqP.length;
                                        }
                                    }
                                    else if(entr == "HELPER")
                                    {
                                        if(config.helpers.indexOf(message.author.id) != -1)
                                        {
                                            premissionsEqualas++;
                                        }
                                    }
                                    else if(message.guild.member(message.author).permissions.has(entr))
                                    {
                                        premissionsEqualas++;
                                    }
                                });
                                if(premissionsEqualas >= reqP.length)
                                {
                                    commands[i].out(bot, message, getValuesAfter(1, args));
                                }
                                else
                                {
                                    if(LangID==0)
                                    {
                                        message.channel.send(new discord.MessageEmbed().setTitle("Ошибка")
                                        .setColor(colors.error).setDescription(":x: У вас недостаточно прав для выполнения данной команды"));
                                    }
                                    else
                                    {
                                        message.channel.send(new discord.MessageEmbed().setTitle("Error")
                                        .setColor(colors.error).setDescription(":x: You have no premissions to use this comand"));
                                    }
                                }
                            }
                            else
                            {
                                commands[i].out(bot, message, getValuesAfter(1, args));   
                            }
                            break;
                        }
                    }
                }
            }  
        }  
    }   
    
    if(LangID == 0)
    {
        if(message.content.toLowerCase().startsWith('я '))
        {
            if(funcs.getRandomInt(0, 100) > 50)
            {
                if(splitForBot(message.content.toLowerCase(), 'я ') != 0 && splitForBot(message.content.toLowerCase(), 'я ').length < 4)
                {
                    var name = funcs.getStrValuesAfter(0, splitForBot(message.content.toLowerCase(), 'я '));
                    message.channel.send('Привет,**' + name + "**, я **" + bot.user.username + "**");
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
/*
    0-общее число
    1-онлайн
    2-ботов
    3-админов - TODO Сделать конфигурацию ролей админов
*/

//TODO перевести названия каналов
setInterval(()=>{

    var en = require('./localisation/en/stat.json');
    var rus = require('./localisation/rus/stat.json');

    var lang = rus;
    var langID = 0;

    var keys = bot.guilds.cache.keyArray();
    for(var i = 0; i < keys.length; i++)
    {
        if(guildF.getLang(keys[i]) == 'rus')
        {
            lang = rus;
        }
        else
        {
            lang = en;
            langID = 1;
        }

        var gc = require('./GuildConfigs/guilds/' + keys[i] + ".json");
        if(gc.statEnabled)
        {
            bot.guilds.cache.get(keys[i]).channels.cache
            .get(gc.statChannels[0]).edit({name: lang.total[0] + bot.guilds.cache.get(keys[i]).memberCount + lang.total[1]})

            var online = 0;
            var uk = bot.guilds.cache.get(keys[i]).members.cache.keyArray();
            for(var j = 0; j < uk.length; j++)
            {
                if(bot.guilds.cache.get(keys[i]).members.cache.get(uk[j]).presence.status == "online")
                {
                    if(!bot.guilds.cache.get(keys[i]).members.cache.get(uk[j]).user.bot)
                    {
                        online ++;
                    }
                }
            }

            bot.guilds.cache.get(keys[i]).channels.cache
            .get(gc.statChannels[1]).edit({name: lang.online + online});

            var bonline = 0;
            var buk = bot.guilds.cache.get(keys[i]).members.cache.keyArray();
            for(var j = 0; j < buk.length; j++)
            {
                if(bot.guilds.cache.get(keys[i]).members.cache.get(buk[j]).user.bot)
                {
                    
                    if(bot.guilds.cache.get(keys[i]).members.cache.get(buk[j]).presence.status == "online")
                    {
                        
                        bonline ++;
                    }
                }
            }

            bot.guilds.cache.get(keys[i]).channels.cache
            .get(gc.statChannels[2]).edit({name: lang.bots + bonline});
        }
    }
}, 5000);