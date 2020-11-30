var ds      =    require('discord.js');
var conf    =    require('../conf.json');
var guildF  =    require('../GuildConfigs/functions');
var fs      =    require('fs');
var funcs   =    require('./functions');
var colors  =    require('../configurations/colors.json');

async function createClan(bot, msg, args)
{
    var guild = guildF.get(msg.guild.id);

    var guildClans;

    if(guild.Clans == null)
    {
        guildClans = new Array();
    } 
    else
    {
        guildClans = guild.Clans;
    }

    if(args[1][2] == '!')
    {
        var clanData = {
            name: args[0],
            owner: funcs.getID(args[1]),
            ownerRole:  await msg.guild.roles.create({data:{name:args[0] + "'s leader", position:0}, reason:'new clan'}),
            memberRole: await msg.guild.roles.create({data:{name:args[0] + "", position:0}, reason:'new clan'}),
            deputyRole: await msg.guild.roles.create({data:{name:args[0] + "'s leader deputy", position:0}, reason:'new clan'}),
            rating : 0,
            open : false,
            balckList: [],
            created: new Date(),
            messages:0,
            symbols:0,
            admSymp:0
        }
        msg.guild.members.cache.get(funcs.getID(args[1])).roles.add([clanData.ownerRole, clanData.memberRole]);

        var overwrites = new ds.Collection;
        var memberPremissions = new ds.Permissions;
        var memberOverwrites = new ds.PermissionOverwrites;
        var everyoneOverwrites = new ds.PermissionOverwrites;
        var deputyOverwrites = new ds.PermissionOverwrites;

        memberPremissions.add("READ_MESSAGE_HISTORY");
        memberPremissions.add("VIEW_CHANNEL");
        memberPremissions.add("SEND_MESSAGES");

        memberOverwrites.allow = memberPremissions;
        everyoneOverwrites.deny = memberPremissions;

        memberOverwrites.id = clanData.memberRole;
        everyoneOverwrites.id = msg.guild.roles.everyone.id;
        deputyOverwrites.id = clanData.deputyRole;

        overwrites.set(msg.guild.roles.everyone.id , everyoneOverwrites);
        overwrites.set(clanData.memberRole.id         , memberOverwrites);

        var category = await msg.guild.channels.create(clanData.name, {type:'category', reason:'new guild', permissionOverwrites:overwrites});
        var geenral  = await msg.guild.channels.create(clanData.name + "'s general", {type:'text', reason:'new guild', permissionOverwrites:overwrites, parent: category});
        var voice    = await msg.guild.channels.create(clanData.name + "'s voice", {type:'voice', reason:'new guild', permissionOverwrites:overwrites, parent: category});

        overwrites = new ds.Collection;

        memberOverwrites.deny = memberPremissions;
        memberOverwrites.allow = null;

        deputyOverwrites.allow = memberPremissions;

        overwrites.set(msg.guild.roles.everyone.id , everyoneOverwrites);
        overwrites.set(clanData.memberRole.id         , memberOverwrites);
        overwrites.set(clanData.deputyRole.id         , deputyOverwrites );

        var deputy = await msg.guild.channels.create(clanData.name + "'s leaders", {type:'text', reason:'new guild', permissionOverwrites:overwrites, parent: category});

        var channels = [geenral.id, deputy.id];

        clanData.clanChannels = channels;

        guildClans.push(clanData);

        guild.Clans = guildClans;

        guildF.set(guild);
    }
}

async function Invite(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    if(args[0][2] == "&")
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    if(args[0] == null)
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var impossible = false;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.ownerRole.id == role
                || clanData.deputyRole.id == role)
            {
                possible = true;
                clan = clanData;
            }
        });
    });

    // console.log(funcs.getID(args[0]));

    var empoyeeRoles = msg.guild.members.cache.get(funcs.getID(args[0])).roles.cache.keyArray();
    empoyeeRoles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.memberRole.id == role)
            {
                possible = false;
            }
        })
    });

    if(!possible)
    {
        msg.react('❌');
        return;
    }

    var invitationMessage = await bot.users.cache.get(funcs.getID(args[0])).send(new ds.MessageEmbed()
    .setAuthor(msg.author.username, msg.author.avatarURL()).setDescription(msg.author.username + lang.invite.decription + clan.name)
    .setTitle(lang.invite.title).setFooter(msg.guild.name, msg.guild.iconURL()).setColor(colors.info));

    invitationMessage.react('❌'); invitationMessage.react('✅');

    msg.react('✅');

    var intervalID = 0;

    intervalID = setInterval(()=>{
        if(invitationMessage.reactions.cache.get('✅').users.cache.keyArray().length > 1)
        {
            msg.guild.members.cache.get(funcs.getID(args[0])).roles.add([clan.memberRole.id]);
            invitationMessage.delete();
            clearInterval(intervalID);
        }
        if(invitationMessage.reactions.cache.get('❌').users.cache.keyArray().length > 1)
        {
            invitationMessage.delete();
            clearInterval(intervalID);
        }
    }, 5000)
}

function kick(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    if(args[0] == null)
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    if(args[0][2] == "&")
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var impossible = false;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.ownerRole.id == role
                || clanData.deputyRole.id == role)
            {
                possible = true;
                clan = clanData;
            }
        });
    });

    if(!possible)
    {
        msg.react('❌');
        return;
    }

    // console.log(funcs.getID(args[0]));
    var empoyeeRoles = msg.guild.members.cache.get(funcs.getID(args[0])).roles.cache.keyArray();
    empoyeeRoles.forEach((role)=>{

        if(clan.ownerRole == role)
        {
            possible = false;
        }
        
    });

    if(!possible)
    {
        console.log('emplyee roles err');
        msg.react('❌');
        return;
    }

    msg.guild.members.cache.get(funcs.getID(args[0])).roles.remove([clan.memberRole.id, clan.deputyRole.id], "kicked");

    bot.users.cache.get(funcs.getID(args[0])).send(new ds.MessageEmbed().setColor(colors.error)
    .setTitle(lang.kick.title).setDescription('"' + clan.name + '"' + lang.kick.description + msg.author.username)
    .addField(lang.kick.reason, funcs.getStrValuesAfter(1, args)).setAuthor(msg.author.username, msg.author.avatarURL())
    .setFooter(msg.guild.name, msg.guild.iconURL()));

    msg.react('✅');

    var clanPos = Clans.indexOf(clan);
    clan.balckList.push(funcs.getID(args[0]));
    Clans[clanPos] = clan;
    guild.Clans = Clans;
    guildF.set(guild);
}

function openClan(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.ownerRole.id == role)
            {
                possible = true;
                clan = clanData;
            }
        });
    });
    
    if(!possible)
    {
        msg.react('❌');
        return;
    }

    if(clan.open)
    {
        msg.react('❌');
        return;
    }

    var clanPos = Clans.indexOf(clan);
    clan.open = true;
    Clans[clanPos] = clan;
    guild.Clans = Clans;
    console.log(clan);
    setTimeout(()=>{
        guildF.set(guild);
    }, 1000)
    msg.react('✅');
}

function closeClan(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.ownerRole.id == role
                || clanData.deputyRole.id == role)
            {
                possible = true;
                clan = clanData;
            }
        });
    });
    
    if(!possible)
    {
        msg.react('❌');
        return;
    }

    if(!clan.open)
    {
        msg.react('❌');
        return;
    }

    var clanPos = Clans.indexOf(clan);

    clan.open = false;

    Clans[clanPos] = clan;

    guild.Clans = Clans;

    guildF.set(guild);
    msg.react('✅');
}

function enterClan(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    if(args[0] == null)
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    if(args[0][2] == "&")
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = true;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.memberRole == role)
            {
                possible = false;
            }
        });
    });

    if(!possible)
    {
        console.log('Error 3')
        msg.react('❌');
        return;
    }

    possible = false;

    Clans.forEach((clanData)=>{
        if(clanData.name.toLowerCase() == args[0].toLowerCase())
        {
            possible = true;
            clan = clanData;
        }
    });

    if(!possible)
    {
        console.log('Error 4')
        msg.react('❌');
        return;
    }
    
    possible = false;

    if(clan.balckList.indexOf(msg.author.id) == -1)
    {
        possible = true;
    }

    if(!possible)
    {
        console.log('Error 5')
        msg.react('❌');
        return;
    }

    if(!clan.open)
    {
        console.log('Error 6')
        msg.react('❌');
        return;
    }

    msg.guild.member(msg.author).roles.add([clan.memberRole.id]);
    msg.react('✅');
}

function leaveClan(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var clan;
    var leader = false;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.memberRole.id == role)
            {
                possible = true;
                clan = clanData
            }
            if(clanData.ownerRole.id == role)
            {
                leader = true;
            }
        });
    });

    if(!possible || leader)
    {
        msg.react('❌');
        return;
    }

    if(!clan.open)
    {
        console.log('Error 6')
        msg.react('❌');
        return;
    }

    msg.guild.member(msg.author).roles.remove([clan.memberRole.id, clan.deputyRole.id]);
    msg.react('✅');
}

function getClanInfo(bot, msg, args)
{

    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);
    var Clans = guild.Clans;
    
    var clan;

    var possible = false;
    if(args[0] == null)
    {
        msg.guild.member(msg.author).roles.cache.keyArray().forEach((role)=>{
            Clans.forEach((clanData)=>{
                if(clanData.memberRole.id == role)
                {
                    clan = clanData;
                    possible = true;
                }
            });
        });
        if(!possible)
        {
            msg.react('❌');
            return;
        }        
    }
    else
    {
        if(args[0][0] == '<' && args[0][args[0].length -1] == '>')
        {
            Clans.forEach((clanData)=>{
                if(clanData.memberRole == funcs.getID(args[0]))
                {
                    clan = clanData;
                    possible = true;
                }
            });
        }

        else
        {
            Clans.forEach((clanData)=>{
                if(clanData.name == args[0])
                {
                    clan = clanData;
                    possible = true;
                }
            });
        }
        if(!possible)
        {
            msg.react('❌');
            return;
        }     
    }

    var embed = new ds.MessageEmbed().setColor(colors.info);
    var data = ":crown: **" + lang.data.owner + " -** " + msg.guild.members.cache.get(clan.owner).displayName + "\n";
    data += ":military_medal: **" + lang.data.rating  +" -** "+ clan.rating + "(" + clan.admSymp + ")" + "\n";
    data += ":busts_in_silhouette: " + GetClanMembers(clan, msg.guild.id, bot).length + " **" + funcs.declNum(GetClanMembers(clan, msg.guild.id, bot).length, lang.data.membersCount) + "**";


    var title = clan.name;
    // if(clan.open)
    // {
    //     title+="  :green_circle:";
    // }
    // else
    // {
    //     title+="  :red_circle:";
    // }

    embed.setTitle(title);
    embed.setDescription(data);

    embed.setThumbnail(bot.users.cache.get(clan.owner).avatarURL);
    // embed.setTimestamp(clan.create);

    if(clan.open)
    {
        embed.addField(":green_circle: " + lang.data.clan_open.title, lang.data.clan_open.body + " `" + guildF.getPrefix(msg.guild.id) + module.exports.commands[3].name[langID] + "`");
    }
    else
    {
        var leaders = "";
        GetClanLeaders(clan, msg.guild.id, bot).forEach(leader => {
            var user = msg.guild.members.cache.get(leader);
            leaders += "• <@"+ user.id +"> \n"; 
        });

        embed.addField(":red_circle: " + lang.data.clan_closed.title, lang.data.clan_closed.body + leaders);
    }
    // :police_officer_tone3: 
    if(GetClanMembers(clan, msg.guild.id, bot).length <= 15)
    {
        var membersStr = "";

        var leaders = GetClanLeaders(clan, msg.guild.id, bot);
        var owner = msg.guild.members.cache.get(clan.owner);

        membersStr += "•" + owner.user.username + "#" + owner.user.discriminator + ":crown: \n";

        leaders.forEach(memberId => {
            if(memberId != clan.owner)
            {
                var user = msg.guild.members.cache.get(memberId);
                membersStr += "•" + user.user.username + "#" + user.user.discriminator;
                membersStr += ":police_officer_tone3:";
                membersStr += "\n";
            }
        })

        GetClanMembers(clan, msg.guild.id, bot).forEach(memberId => {
            if(leaders.indexOf(memberId) == -1)
            {
                var user = msg.guild.members.cache.get(memberId);
                membersStr += "•" + user.user.username + "#" + user.user.discriminator;

                membersStr += "\n";
            }
        })
        embed.addField(lang.data.members, membersStr);
    }

    msg.channel.send(embed);
}

function Promotion(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    if(args[0][2] == "&")
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    if(args[0] == null)
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.ownerRole.id == role)
            {
                possible = true;
                clan = clanData;
            }
        });
    });
    
    if(!possible)
    {
        msg.react('❌');
        return;
    }

    var promotor = msg.guild.members.cache.get(funcs.getID(args[0]));
    
    if(promotor == null)
    {
        msg.react('❌');
        return;
    }

    if(!promotor.roles.cache.has(clan.memberRole.id))
    {
        msg.react('❌');
        return;
    }

    if(promotor.roles.cache.has(clan.deputyRole.id) || promotor.roles.cache.has(clan.ownerRole.id))
    {
        msg.react('❌');
        return;
    }

    promotor.roles.add([clan.deputyRole.id]);
    msg.react('✅');

}

function DisPromotion(bot, msg, args)
{
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == "rus")
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = guildF.get(msg.guild.id);

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    if(args[0][2] == "&")
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    if(args[0] == null)
    {
        console.log('Error 2')
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.ownerRole.id == role)
            {
                possible = true;
                clan = clanData;
            }
        });
    });
    
    if(!possible)
    {
        msg.react('❌');
        return;
    }

    var promotor = msg.guild.members.cache.get(funcs.getID(args[0]));
    
    if(promotor == null)
    {
        msg.react('❌');
        return;
    }

    if(!promotor.roles.cache.has(clan.memberRole.id))
    {
        msg.react('❌');
        return;
    }

    if(!promotor.roles.cache.has(clan.deputyRole.id) || promotor.roles.cache.has(clan.ownerRole.id))
    {
        msg.react('❌');
        return;
    }

    promotor.roles.remove([clan.deputyRole.id]);
    msg.react('✅');

}

function GetClanMembers(clan, guildID, bot)
{
    var users = new Array();

    bot.guilds.cache.get(guildID).members.cache.forEach(member => {
        if(member.roles.cache.has(clan.memberRole.id))
        {
            users.push(member.id);
        }
    })

    return users;
}

function GetClanLeaders(clan, guildID, bot)
{
    var users = new Array();

    bot.guilds.cache.get(guildID).members.cache.forEach(member => {
        if(member.roles.cache.has(clan.ownerRole.id) || member.roles.cache.has(clan.deputyRole.id))
        {
            users.push(member.id);
        }
    })

    return users;
}

function addAdmSymp(bot, msg, args)
{
    // console.log('trying');

    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.getLang(msg.guild.id) == 'rus')
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }
    // console.log(msg.guild);
    var guild = require('../GuildConfigs/guilds/' + msg.guild.id + '.json');
    var Clans = guild.Clans;
    
    var clan;

    var possible = false;
    if(args[0] == null)
    {
        msg.guild.member(msg.author).roles.cache.keyArray().forEach((role)=>{
            Clans.forEach((clanData)=>{
                if(clanData.memberRole.id == role)
                {
                    clan = clanData;
                    possible = true;
                }
            });
        });
        if(!possible)
        {
            msg.react('❌');
            return;
        }        
    }
    else
    {
        if(args[0][0] == '<' && args[0][args[0].length -1] == '>')
        {
            Clans.forEach((clanData)=>{
                if(clanData.memberRole == funcs.getID(args[0]))
                {
                    clan = clanData;
                    possible = true;
                }
            });
        }

        else
        {
            Clans.forEach((clanData)=>{
                if(clanData.name == args[0])
                {
                    clan = clanData;
                    possible = true;
                }
            });
        }
        if(!possible)
        {
            msg.react('❌');
            return;
        }     
    }
    try{
        clan.admSymp += parseInt(args[1]);
        clan.rating += parseInt(args[1]);
        var clanPos = Clans.indexOf(clan);

        Clans[clanPos] = clan;

        guild.Clans = Clans;

        guildF.set(guild);
        msg.react('✅');

    }catch(e){
        msg.channel.send(e);
        msg.react('❌');
    }
}

function Top(bot, msg, args)
{
    // console.log('trying');

    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.get(msg.guild.id).Language == 'rus')
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }
    // console.log(msg.guild);
    var guild = guildF.get(msg.guild.id);
    var Clans = guild.Clans;

    Clans.sort((prev, next) => next.rating - prev.rating);

    var string = "";

    Clans.forEach(clan => {
        string += "**" + parseInt(Clans.indexOf(clan) + 1) + "** - " + clan.name + " (" + clan.rating + ")\n";
    })

    msg.channel.send(new ds.MessageEmbed().setColor(colors.info).setTitle(lang.top).setDescription(string));
}

var Delete = (bot, msg, args) => {
    var en = require('../localisation/en/clans.json');
    var rus = require('../localisation/rus/clans.json');

    var lang = rus;
    var langID = 0;

    if(guildF.getLang(msg.guild.id) == 'rus')
    {
      lang = rus;
    }
    else
    {
      lang = en;
      langID = 1;
    }

    var guild = require('../GuildConfigs/guilds/' + msg.guild.id + '.json');

    if(typeof guild.Clans == 'undefined')
    {
        console.log('Error 1');
        msg.react('❌');
        return;
    }

    var Clans = guild.Clans;

    var roles = msg.guild.member(msg.author).roles.cache.keyArray();

    var possible = false;
    var clan;

    roles.forEach((role)=>{
        Clans.forEach((clanData)=>{
            if(clanData.ownerRole.id == role)
            {
                possible = true;
                clan = clanData;
            }
        });
    });

    if(!possible)
    {
        msg.react('❌');
        return;
    }

    var clanPos = Clans.indexOf(clan);

    clan.clanChannels.forEach(channel => {
        bot.channels.cache.get(channel).delete();
    });

    msg.guild.roles.cache.get(clan.ownerRole.id).delete();
    msg.guild.roles.cache.get(clan.memberRole.id).delete();
    msg.guild.roles.cache.get(clan.deputyRole.id).delete();

    Clans.splice(clanPos, 1);

    msg.react('✅');
}

// � �
module.exports.commands = [
    {name:[['клан.создать'], ['clan.create']], out:createClan, ab:["Создайте клан - укажите его Название и Лидера. Пусть дорога принесёт их в тёплые пески Эльсвейра",
    "NaN"], 
    requedPremissons:["ADMINISTRATOR"]},

    {name:[['клан.принять'], ['clan.invite']], out:Invite, ab:["Пригласите людей к себе в клан(Укажите имя в качестве аргумента)",
    "Hey! You need more soliders! Invite somebody. (Enter its name as an argument)"]},

    {name:[['клан.исключить'], ['clan.kick']], out:kick, ab:["- Вот! Вот он не хороший человек. Предлагаю его исключить! \n - Но кого? \n - Так в качестве аргумента указано \;)",
    [" - He! He is the bad guy! \n - So, is his name entered as argument? \n - I don't know. Ask user.. but it should happen"]]},

    {name:[['клан.вступить'], ['clan.join']], out:enterClan, ab:["Вступить в открытый клан",
    "It's time for you to go on the road of adventure! Find an open clan and go! (specify its name as an argument)"]},

    {name:[['клан.выйти'], ['clan.leave']], out:leaveClan, ab:["Выйти из клана",
    "Complex life as a warrior has broken you? Well, it's time to finish, you're right. Just leave the clan (if it is, of course, open)"]},

    {name:[['клан.статистика'], ['clan.stat']], out:getClanInfo, ab:["Получить статистику клана",
    "Well? How much gold have we collected and how many of us are there? Let's look at our statistics."]},

    {name:[['клан.повысить'], ['clan.promote']], out:Promotion, ab:["Повысьте человека до заместителя, указав его имя в качестве аргумента",
    "Sir, he served well and I think he has earned your trust. Enter his name as an argument and make him your Deputy"]},

    {name:[['клан.понизить'], ['clan.dispromote']], out:DisPromotion, ab:["Понизьте человека, указав его имя в качестве аргумента",
    "No? Did he break your trust? Well, he can still be demoted to a regular soldier.. If, of course, you specify its name as an argument"]},

    {name:[['клан.открыть'], ['clan.open']], out:openClan, ab:["Откройте клан для всех желающих", 
    "Open your clan to all comers, let all the brave in spirit and strong in body come to you!"]},

    {name:[['клан.закрыть'], ['clan.close']], out:closeClan, ab:["Закройте клан и вступить в него можно будет только по приглашению",
    "Oh no, we already have too many secrets and secrets. We need to close the clan so that we don't get outsiders"]},

    {name:[['рейтинг', 'рейтнг.изменить'], ['rating']], out:addAdmSymp, ab:["Secret admin command", "Secret admin command"], requedPremissons:["ADMINISTRATOR"]},

    {name:[['топ'], ['top']], out:Top, ab:["Получить топ участников", "Which clan is the best? Which clan is in second place? Which one is on the third? Hmmm..."],},

    {name:[['клан.удалить'], ['clan.delete']], out:Delete, ab:["Потом чё-нить напишу", "Write something later"]}
]

module.exports.about = {
    name: [["кланы", "клан"], ["сlans", "clan"]],
    about:["Устройте эпичные битвы кланов(Сами, конечно же, я просто помогу вести учёт <3)", "Arrange epic clan battles(By yourself, of course, I'll just help you keep track of <3)"]
}

function addRating(msg)
{

        if(msg.deleted)
        {
            return;
        }

        if(msg.guild == null)
        {
            return;
        }

        var guild = require('../GuildConfigs/guilds/' + msg.guild.id + '.json');

        if(typeof guild.Clans == 'undefined')
        {
            return;
        }

        var Clans = guild.Clans;

        var roles = msg.guild.member(msg.author).roles.cache.keyArray();

        var possible = false;
        var clan;

        roles.forEach((role)=>{
            Clans.forEach((clanData)=>{
                if(clanData.ownerRole.id == role)
                {
                    clan = clanData;
                }
            });
        });

        if(clan == null)
        {
            return;
        }

        if(clan.clanChannels.indexOf(msg.channel.id) != -1)
        {
            return;
        }

        if(clan.admSymp == null)
        {
            clan.admSymp = 0;
        }

        clan.messages += 1;
        clan.symbols += msg.content.length;

        // var n = 0.6;
        // var boost = 100;
        // clan.rating = clan.admSymp + Math.trunc(((clan.symbols) * boost) / (clan.messages * (1/n)));

        // console.log(clan);

        var clanPos = Clans.indexOf(clan);

        Clans[clanPos] = clan;

        guild.Clans = Clans;

        guildF.set(guild);
    
}

module.exports.raiting = addRating;