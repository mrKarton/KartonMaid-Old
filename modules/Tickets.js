var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var fs = require('fs');
var guildF = require('../GuildConfigs/functions');
var colors = require('../configurations/colors.json');


function reportInit(bot, msg, args)
{
    var guild = require('../GuildConfigs/guilds/' + msg.guild.id + ".json");

    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    if(!guild.reportInit)
    {
        if(guildF.getLang(msg.guild.id) == "en")
        {
            lang = en;
        }

        var userChannel  = funcs.getID(args[0]);
        var adminChannel = funcs.getID(args[1]);
        

        bot.channels.cache.get(adminChannel).send(new discord.MessageEmbed().setColor(colors.success).setDescription(lang.reports.admInit));
        bot.channels.cache.get(userChannel).send(new discord.MessageEmbed().setColor(colors.success).setDescription(lang.reports.usrInit));

        guild.reportInit = true;
        guild.admReport = adminChannel;
        guild.usrReport = userChannel;

        fs.writeFileSync('./GuildConfigs/guilds/' + msg.guild.id + ".json", JSON.stringify(guild));
    }
    
}

async function reportMember(bot, msg, args)
{
    var en = require('../localisation/en/admin.json');
    var rus = require('../localisation/rus/admin.json');

    var lang = rus;

    var guild = require('../GuildConfigs/guilds/' + msg.guild.id + ".json");
    
    if(guild.reportInit)
    {

        var attachments = new Array();
        // msg.attachments.forEaсh((attachment)=>{attachments.push(attachment.attachment)});

        msg.attachments.forEach((att)=>{attachments.push(att.attachment)})

        var admEmbed = new discord.MessageEmbed().setColor(colors.info)
        .setTitle(lang.reports.newTicket).setAuthor(msg.author.username, msg.author.avatarURL()).setDescription(funcs.getStrValuesAfter(0, args))
        // .setImage(attachments[0]);

        attachments.forEach((att)=>{admEmbed.setImage(att)})
        admEmbed.setURL(msg.url);
        var admMessage = await bot.channels.cache.get(guild.admReport).send(admEmbed);

        var usrMessage = await bot.channels.cache.get(guild.usrReport).send(new discord.MessageEmbed().setColor(colors.info)
        .setTitle(lang.reports.newTicket).setAuthor(msg.author.username, msg.author.avatarURL()).setDescription(funcs.getStrValuesAfter(0, args)));
        // console.log(admMessage);
        admMessage.react('❌'); admMessage.react('✅');

        var ticket = {
            server     : msg.guild.id,
            admMessage : admMessage.id,
            usrMessage : usrMessage.id
        }

        var allTickets = require('../configurations/report-messages.json');

        allTickets.push(ticket);

        fs.writeFileSync('./configurations/report-messages.json', JSON.stringify(allTickets));
    }
}

module.exports.commands = [
    {name:[["жалобы.вкл", "рк", "жалобный-канал"], ["rc", "tickets.on", "ticket-channel"]], out:reportInit, 
    ab:["Установите парочку каналов для жалоб. На *закрытый админский канал*™ придёт репорт с двумя реакциями - нажми на ту, которая соответствует принятию или отторжению жалобы. Эта реакция автоматически отобразится под сообщением в другом, публичном канале жалоб, куда эти сообщения будут дублироваться \n синтaксис: `[#публичный-канал(для всех)] [#закрытый канал(для админов)]`",
    "||Translated within of Yandex translator||Set up a couple of channels for complaints. On *closed admin channel* you will receive a report with two reactions - click on the one that corresponds to the acceptance or rejection of the complaint. This response is automatically displayed under the message in a different, public complaint channel, where these messages will be duplicated \n syntax `[#public-channel(for all)] [#private channel(for admins)]`"],
    requedPremissons:["ADMINISTRATOR"]},

    {name:[["тикет", "жалоба", "пожаловаться"], ["ticket"]], out:reportMember, 
    ab:["Товарищ админ, он нарушает правила! Пожалуйтесь на плохого человека. Дальше программистская магия отправит это сообщение в специальный канал, а админ примет эту жалобу.. или нет.. узнаете по реакции под сообщением",
    "||Translated with google cause developer is lasy ass|| Comrade admin, he's breaking the rules! Complain about the bad person. Then programming magic will send this message to a special channel, and the admin will accept this complaint.. or not.. find out by the reaction under the message"]}
];

module.exports.about = {name:[["тикеты"], ["tickets"]], about:["Всё о жалобах и предложениях", 
"Book of complaints and suggestions mechanic there"]}