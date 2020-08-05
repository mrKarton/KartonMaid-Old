var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var moduler = require('../moduler.js');
var YouTube = require('youtube-node');
var youTube = new YouTube();
var ytdl = require('ytdl-core');
var colors = require('../configurations/colors.json');
var guildF = require('../GuildConfigs/functions');
var en = require('../localisation/en/music.json');
var rus = require('../localisation/rus/music.json');

setInterval(()=>{
  en = require('../localisation/en/music.json');
  rus = require('../localisation/rus/music.json');
}, 1000 * 60 * 5);

var queue = new Map();

function start(bot, msg, args)
{
  var lang = rus;

  if(guildF.getLang(msg.guild.id) == 'rus')
  {
    lang = rus;
  }
  else
  {
    lang = en;
  }

  if(!queue.has(msg.guild.id))
  {
    if(msg.guild.member(msg.author).voice.channel == null)
    {
      msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setDescription(lang.play.ConnErr));
    }
    else
    {
      queue.set(msg.guild.id, {songs:new Array(), msg:msg, channel: msg.guild.member(msg.author).voice.channel.id, position: 0});
      queue.get(msg.guild.id).songs.push(funcs.getStrValuesAfter(0, args));
      play(msg, funcs.getStrValuesAfter(0, args));
    }
  }
  else
  {
    add(bot, msg, args)
  }
}

function play(msg, name)
{
  var lang;

  if(guildF.getLang(msg.guild.id) == 'rus')
  {
    lang = rus;
  }
  else
  {
    lang = en;
  }

    youTube.setKey('AIzaSyBgNgwLuvYIfK1WMfsJTSr2JKgziSLsPF8');

    youTube.search(name, 2, function(error, result) {
        if (error) {
          msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.play.unexpectedError).setDescription(error));
        }
        else {

          var res = JSON.stringify(result, null, 2);
          var name = JSON.parse(res).items[0].snippet.title;
          var photo = JSON.parse(res).items[0].snippet.thumbnails.medium.url;
          var link = "https://youtu.be/" + JSON.parse(res).items[0].id.videoId;
          var DateP = new Date(JSON.parse(res).items[0].snippet.publishTime);
          var footer = JSON.parse(res).items[0].snippet.channelTitle;
          
          var chnl = msg.guild.member(msg.author).voice.channel;


          Stream(chnl, link, msg);

          msg.channel.send(new discord.MessageEmbed({createdAt: DateP}).setTitle(lang.play.title).setDescription(name).setImage(photo).setFooter(footer).setColor(colors.info)
          .setTimestamp(DateP));
          
        }
    }); 
}//

function add(bot, msg, args)
{
  var lang = rus;

  if(guildF.getLang(msg.guild.id) == 'rus')
  {
    lang = rus;
  }
  else
  {
    lang = en;
  }

  if(queue.has(msg.guild.id))
  {
    if(msg.guild.member(msg.author).voice.channel != null)
    {
      if(msg.guild.member(msg.author).voice.channel.id == bot.voice.connections.get(msg.guild.id).channel.id)
      {
        queue.get(msg.guild.id).songs.push(funcs.getStrValuesAfter(0, args));
        msg.channel.send(new discord.MessageEmbed().setColor(colors.success).setTitle(lang.add.title)
        .setDescription(lang.add.body[0] + "**" + funcs.getStrValuesAfter(0, args) + "**" + lang.add.body[1]));
      }
      else
      {
        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.add.errorTitle)
        .setDescription(lang.add.ConnErr));
      }
    }
    else
    {
      msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.add.errorTitle)
      .setDescription(lang.add.ConnErr));
    }
  }
  else
  {
    msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.add.errorTitle).setDescription(lang.add.notStarted));
  }
}

function Stop(bot, msg, args)
{
  var lang = rus;

  if(guildF.getLang(msg.guild.id) == 'rus')
  {
    lang = rus;
  }
  else
  {
    lang = en;
  }

  if(queue.has(msg.guild.id))
  {
    if(msg.guild.member(msg.author).voice.channel != null)
    {
      if(msg.guild.member(msg.author).voice.channel.id == bot.voice.connections.get(msg.guild.id).channel.id)
      {
        queue.get(msg.guild.id).connection.disconnect();
        queue.delete(msg.guild.id);
        msg.channel.send(new discord.MessageEmbed().setColor(colors.info).setTitle(lang.stop.title)
        .setDescription(lang.stop.body));
      }
      else
      {
        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.stop.errorTitle)
        .setDescription(lang.stop.ConnErr));
      }
    }
    else
    {
      msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.stop.errorTitle)
      .setDescription(lang.stop.ConnErr));
    }
  }
  else
  {
    msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.stop.errorTitle).setDescription(lang.stop.notStartd));
  }
}

function Skip(bot, msg, args)
{
  var lang = rus;

  if(guildF.getLang(msg.guild.id) == 'rus')
  {
    lang = rus;
  }
  else
  {
    lang = en;
  }

  if(queue.has(msg.guild.id))
  {
    if(queue.get(msg.guild.id).songs.length - 1 == queue.get(msg.guild.id).position)
    {
      msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.skip.errTitle)
      .setDescription(lang.skip.queueErr));
    }
    else
    {
      if(msg.guild.member(msg.author).voice.channel != null)
      {
        if(msg.guild.member(msg.author).voice.channel.id == bot.voice.connections.get(msg.guild.id).channel.id)
        {
          queue.get(msg.guild.id).position += 1;
          play(msg, queue.get(msg.guild.id).songs[queue.get(msg.guild.id).position]);
        }
        else
        {
          msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.skip.errTitle)
          .setDescription(lang.skip.ConnErr));
        }
      }
      else
      {
        msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.skip.errTitle)
        .setDescription(lang.skip.ConnErr));
      }
    }
  }
  else
  {
    msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.skip.errTitle)
        .setDescription(lang.skip.notStarted));
  }
}

function goBack(bot, msg, args)
{

  var lang = rus;

  if(guildF.getLang(msg.guild.id) == 'rus')
  {
    lang = rus;
  }
  else
  {
    lang = en;
  }

  if(queue.has(msg.guild.id))
  {
    if(queue.get(msg.guild.id).position == 0)
    {
      msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.goBack.errTitle)
      .setDescription(lang.goBack.queueErr));
    }
    else
    {
      if(msg.guild.member(msg.author).voice.channel != null)
      {
        if(msg.guild.member(msg.author).voice.channel.id == bot.voice.connections.get(msg.guild.id).channel.id)
        {
          queue.get(msg.guild.id).position -= 1;
          play(msg, queue.get(msg.guild.id).songs[queue.get(msg.guild.id).position]);
        }
        else
        {
          msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.goBack.errTitle)
          .setDescription(lang.goBack.ConnErr));
        }
      }
      else
        {
          msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.goBack.errTitle)
          .setDescription(lang.goBack.ConnErr));
        }
    }
  }
  else
  {
    msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.goBack.errTitle)
        .setDescription(lang.goBack.notStarted));
  }
}

function getQueue(bot, msg, args)
{
  var lang = rus;

  if(guildF.getLang(msg.guild.id) == 'rus')
  {
    lang = rus;
  }
  else
  {
    lang = en;
  }

  if(queue.has(msg.guild.id))
  {
    var str = "";
    for(var i = 0; i < queue.get(msg.guild.id).songs.length; i++)
    {
      if(i == queue.get(msg.guild.id).position)
      {
        str += "***->***  "
      }
      str += "**" + i + "** - " + queue.get(msg.guild.id).songs[i] + "\n\n";
    }
    msg.channel.send(new discord.MessageEmbed().setColor(colors.info).setTitle(lang.getQueue.Title).setDescription(str));
  }
  else
  {
    msg.channel.send(new discord.MessageEmbed().setColor(colors.error).setTitle(lang.getQueue.errTitle)
        .setDescription(lang.getQueue.err));
  }
}

async function Stream(voiceChannel, link, msg) {
  const connection = await voiceChannel.join();
  
  connection.play(ytdl(link, {filter:'audioonly'}), {type:'opus'});

  connection.dispatcher.on('finish', ()=> {
    if(queue.get(voiceChannel.guild.id).songs.length - 1 == queue.get(voiceChannel.guild.id).position)
    {
      connection.disconnect();
      queue.delete(msg.guild.id);
    }
    else
    {
      queue.get(voiceChannel.guild.id).position += 1;
      play(msg, queue.get(voiceChannel.guild.id).songs[queue.get(voiceChannel.guild.id).position]);
    }
  });
  queue.get(voiceChannel.guild.id).connection = connection;
}

var list = [
    {name: [["играть"], ["play"]], out:start, 
    ab:["Привнесёт веселья в вашу тусу! Введите название песни и музыка начнёт играть! Ю-ХУ!",
    "***Start your party!*** Launch music streaming into your voice channel. (Type title as argument)"]},

    {name: [["добавить", "адд"],["add"]], out:add, 
    ab:["Создайте свой невероятный плейст, добавив в него трек вам по душе.", "\"*I want more music!!*\" - **Add track into your queue**"]},

    {name: [["очередь", "порядок"], ["queue"]], out:getQueue, ab:["Узнайте, что играет сейчас и что будет играть далее с помощью этой команды!",
    "\"*What's playing now, What will be playing? Let me see..*\" - **get your queue**"]},

    {name: [["стоп"], ["stop"]], out:Stop, ab:["Остновите воспроизведение и закрйте плеер! Вечеринка закончилась.",
    "\"*Oh, i'm so tried. Let's turn it off..*\" - **stop your music streaming**"]},

    {name: [["скип", "следущ", "пропуск", "пропустить"],["skip","next"]], out:Skip, 
    ab:["\"Кто-нибудь, вырубите это №;!2\" - пропустите текущий трек с помощью этой команды",
    "\"*Hmm, this is a very boring song,*\" - **let's skip to the next one**"]},

    {name: [["возврат", "предыдущ"], ["back"]], out:goBack, 
    ab:["Блин, прошлая песня была не плоха, давайте ещё раз её послушаем? А давайте! Включите предыдущую песню с помощью **ВОТ ЭТОЙ** команды",
    "\"*Ugh, i loved previous track.. Let's turn it on again*\" - **turns on the previous track in your queue**"]}
]

module.exports.commands = list;
module.exports.about = {name:[["музыка", "плеер", "воис"], ["music", "voice"]], 
about: ["О да, наконец-то, блин, нормальная музыка! Подключите бота к своему голосовму каналу и запустите воспроизведение.",
"YEAH! It's a party time! Let's turn on some good song!"]};