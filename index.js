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
var clans = require('./modules/clans.js');

var APIwork = require('./API');

var DBL = require('dblapi.js')
var dbl = new DBL(config.dblToken, bot);
var startupDat;

var mysql = require('mysql2');
const { modules } = require('./moduler');
var connection = mysql.createConnection(config.mysql);

bot.on('ready', ()=> {
    startupDat = new Date();
    bot.startupDate = startupDat;
    console.log(bot.user.username + "#" + bot.user.discriminator + " started");// when bot is ready, message it
    bot.generateInvite(["ADMINISTRATOR"]).then((link)=>{console.log("My link: " + link)});//when invition link created, messgae it

    connection.query('SELECT * FROM `Guilds`', (err, res)=>{
        var DBIDs = new Array();
        res.forEach((dat)=>{
            DBIDs.push(dat.ID);
        })

        bot.guilds.cache.keyArray().forEach((key)=>{
            if(DBIDs.indexOf(key) != -1)
            {
                console.log('Founded - ', key, '\n\n');
            }
            else
            {
                console.log('Lost - ', key);

                var format = mysql.format("INSERT INTO `Guilds`(ID, Language, Prefix, Stat_Enabled, Stat_Channels, Clans, Report_Enabled, Report_Admin, Report_Public) " +
                "VALUES(?,?,?,?,?,?,?,?,?) ", [key, 'en', '!', '0', '[]', '[]', '0', '', '']);
                connection.query(format);
                console.log('Used - ', format);
                console.log('\n\n');
            }
        });
    })
    
    connection.query('SELECT * FROM `Guilds`', (err, res)=>{
        var dataArr = new Array();
        res.forEach((dat)=>{
            var gdat = dat;
            if(dat.Stat_Channels != null)
            {
                gdat.Stat_Channels =JSON.parse(dat.Stat_Channels);
            }
            if(dat.Clans != null)
            {
                gdat.Clans =JSON.parse(dat.Clans);
            }

            dataArr.push(gdat);
        })

        fs.writeFileSync('configurations/guilds-data.temp', JSON.stringify(dataArr));
    });

});

if(!version.dev)
{
    console.log("loggined as main");
    bot.login(config.token); //logining with token from config
}
else
{
    console.log("loggined as dev");
    bot.login(config.devToken); //logining with dev token
}

bot.on('guildCreate', (guild)=>{
    var lang = "en";

    if(guild.region == "russia")
    {
        lang = "rus";
    }

    connection.query('SELECT ID FROM `Guilds` WHERE ID=?', guild.id, (err,res)=>{
        console.log(res);
        if(res.ID == null)
        {
            var format = mysql.format("INSERT INTO `Guilds`(ID, Language, Prefix, Stat_Enabled, Stat_Channels, Clans, Report_Enabled, Report_Admin, Report_Public) " +
            "VALUES(?,?,?,?,?,?,?,?,?) ", [guild.id, lang, '!', '0', '[]', '[]', '0', '', '']);
            connection.query(format);

            if(guild.systemChannel != null)
            {
                guild.systemChannel.send(funcs.getHelloMsg(lang, bot));
            }

            synchronize();
        }
    })
});

bot.on('message', (message)=>{
    
    

    if(message.author.id == bot.user.id)
    {
        return;
    }

    if(message.guild == null)
    {
        message.reply('I don\'t working in DM');
        return;
    }

    clans.raiting(message);

    var LangID = 0;

    if(guildF.get(message.guild.id).Language == "en")
    {
        LangID = 1;
    }

    if(message.guild != null)
    {
        if(message.author.id != bot.user.id)
        {
            
            if(typeof message.guild.id != 'undefined')
            {
                var args = splitForBot(message.content, guildF.get(message.guild.id).Prefix);
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
});

function synchronize()
{
    var guilds = JSON.parse(fs.readFileSync('configurations/guilds-data.temp'));
    // console.log(guilds);
    guilds.forEach((data)=>{
        var format = mysql.format("UPDATE `Guilds` SET Language=?, Prefix=?, Stat_Enabled=?, Stat_Channels=?, Clans=?, Report_Enabled=?, Report_Admin=?, Report_Public=? " +
        "WHERE ID=?", 
        [data.Language, data.Prefix, data.Stat_Enabled, JSON.stringify(data.Stat_Channels),
            JSON.stringify(data.Clans), data.Report_Enabled, data.Report_Admin, data.Report_Public, data.ID]);
        // console.log(JSON.stringify(data.Clans));
        // console.log(format, '\n\n');
        connection.query(format);
    })

    console.log('Database synchronized');

    connection.query('SELECT * FROM `Guilds`', (err, res)=>{
        var dataArr = new Array();
        res.forEach((dat)=>{
            var gdat = dat;
            if(dat.Stat_Channels != null)
            {
                gdat.Stat_Channels =JSON.parse(dat.Stat_Channels);
            }
            if(dat.Clans != null)
            {
                gdat.Clans =JSON.parse(dat.Clans);
            }

            dataArr.push(gdat);
        })

        fs.writeFileSync('configurations/guilds-data.temp', JSON.stringify(dataArr));
    });

    console.log('Data Loaded');
}

setInterval(synchronize, 60000 * 1);

function splitForBot(content, prefix)
{
    if(typeof(content) == typeof("String")) //Checking for type of content (we need a string)
    {
        var step1 = content.split(prefix);//spliting prefix
        var step11 = new Array();
        step1.forEach((elem)=>{
            if(step1.indexOf(elem) != 1 && step1.indexOf(elem) != 0)
            {
                step11.push(prefix+elem);
            }
            else
            {
                step11.push(elem);
            }
        });
        var step12 = funcs.GetString(step11);
        if(step1[1] != null)                     //if there are comands
        {
            var step2 = step12.split(" ");     //spliting arguments
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

setInterval(()=>{

    var en = require('./localisation/en/stat.json');
    var rus = require('./localisation/rus/stat.json');

    var lang = rus;
    var langID = 0;

    var keys = bot.guilds.cache.keyArray();
    for(var i = 0; i < keys.length; i++)
    {
        if(guildF.get(keys[i]).Language == 'rus')
        {
            lang = rus;
        }
        else
        {
            lang = en;
            langID = 1;
        }

        var gc = guildF.get(keys[i]);
        if(gc.statEnabled)
        {
            bot.guilds.cache.get(keys[i]).channels.cache
            .get(gc.Stat_Channels[0]).edit({name: lang.total[0] + bot.guilds.cache.get(keys[i]).memberCount + lang.total[1]})

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
            .get(gc.Stat_Channels[1]).edit({name: lang.online + online});

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
            .get(gc.Stat_Channels[2]).edit({name: lang.bots + bonline});
        }
    }
}, 5000);

setInterval(()=>{
    var messages = require('./configurations/role-messages.json');
    messages.forEach((data)=>{
        bot.channels.cache.get(data.channel)
        .messages.fetch(data.id).then(message=>{
            if(!message.deleted)
            {
                var users = message.reactions.cache.get(data.reaction).users.cache.keyArray();
                console.log(users);
                if(users.length > 0)
                {
                    users.forEach((uId)=>{
                        var user = bot.guilds.cache.get(data.guild).members.cache.get(uId);
                        
                        if(user != null)
                        {
                            if(!user.roles.cache.has(data.role)) 
                            {
                                user.roles.add(data.role);
                            }
                        }
                    })
                }
            }
            else
            {
                messages.splice(messages.indexOf(data), 1);
                fs.writeFileSync('./configurations/role-messages.json', JSON.stringify(messages));
            }
        });
    });
}, 5000);
// ❌ ✅
setInterval(()=>{
    var tickets = require('./configurations/report-messages.json');
    tickets.forEach((ticket)=>{
        var guild = guildF.get(ticket.server);
        var end = false;
        var admMessage = bot.channels.cache.get(guild.Report_Admin).messages.fetch(ticket.admMessage).then(message=>{
            message.reactions.cache.get('❌').users.cache.keyArray().forEach((uID)=>{
                if(uID != bot.user.id)
                {
                    if(bot.guilds.cache.get(ticket.server).members.cache.get(uID).hasPermission("ADMINISTRATOR"))
                    {
                        bot.channels.cache.get(guild.Report_Public).messages.fetch(ticket.usrMessage).then(msg=>{msg.react('❌')});

                        tickets.splice(tickets.indexOf(ticket), 1);
                        fs.writeFileSync('./configurations/report-messages.json', JSON.stringify(tickets));
                        end = true;
                    }
                }
            });
            
            if(!end)
            {
                message.reactions.cache.get('✅').users.cache.keyArray().forEach((uID)=>{
                    if(uID != bot.user.id)
                    {
                        if(bot.guilds.cache.get(ticket.server).members.cache.get(uID).hasPermission("ADMINISTRATOR"))
                        {
                            bot.channels.cache.get(guild.Report_Public).messages.fetch(ticket.usrMessage).then(msg=>{msg.react('✅')});

                            tickets.splice(tickets.indexOf(ticket), 1);
                            fs.writeFileSync('./configurations/report-messages.json', JSON.stringify(tickets));
                        }
                    }
                })
            }

        });
    });
}, 5000);

setInterval(()=>{
    bot.guilds.cache.keyArray().forEach(gID =>{
        var guild = guildF.get(gID);
        if(typeof guild.clans != 'undefined')
        {
            if(guild.clans.length > 0)
            {   
                var newClans = new Array();
                guild.clans.forEach(clan => {
                    if(clan.messages > 0)
                    {
                        var n = 0.6;
                        var boost = 1;
                        clan.rating += Math.trunc(((clan.symbols) * boost) / (clan.messages * (1/n)));
                        clan.messages = 0;
                        clan.symbols = 0;
                        
                    }

                    newClans.push(clan);
                });
                guild.clans = newClans;
                guildF.set(guild);
            }
        }
    })
}, 1000 * 1 * 5)

