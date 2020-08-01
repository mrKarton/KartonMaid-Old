var discord = require('discord.js');
var conf = require('../conf.json');
var funcs = require('./functions.js');
var moduler = require('../moduler.js');
var YouTube = require('youtube-node');
var youTube = new YouTube();
var ytdl = require('ytdl-core');

var queue = new Map();

function start(bot, msg, args)
{
  if(!queue.has(msg.guild.id))
  {
    if(msg.guild.member(msg.author).voice.channel == null)
    {
      msg.channel.send(new discord.MessageEmbed().setColor('#ff2b2b').setDescription("Вы должны быть подглючены к голосовому каналу, что бы слушать это!"));
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
    msg.reply("Уже играю");
  }
}

function play(msg, name)
{
    youTube.setKey('AIzaSyBgNgwLuvYIfK1WMfsJTSr2JKgziSLsPF8');

    youTube.search(name, 2, function(error, result) {
        if (error) {
          msg.channel.send(new discord.MessageEmbed().setColor('#ff2b2b').setTitle("Произошла неожиданная ошибка").setDescription(error));
        }
        else {

          var res = JSON.stringify(result, null, 2);
          var name = JSON.parse(res).items[0].snippet.title;
          var photo = JSON.parse(res).items[0].snippet.thumbnails.medium.url;
          var link = "https://youtu.be/" + JSON.parse(res).items[0].id.videoId;
          var DateP = new Date(JSON.parse(res).items[0].snippet.publishTime);
          var footer = JSON.parse(res).items[0].snippet.channelTitle + "  *  " + DateP.getDay() + " - " + DateP.getMonth() + " - " + DateP.getFullYear();
          
          var chnl = msg.guild.member(msg.author).voice.channel;


          Stream(chnl, link, msg);
          msg.channel.send(new discord.MessageEmbed({createdAt: DateP}).setTitle("Сейчас играет.. ").setDescription(name).setImage(photo).setFooter(footer));
          
        }
    }); 
}//

function add(bot, msg, args)
{
  if(queue.has(msg.guild.id))
  {
    if(msg.guild.member(msg.author).voice.channel.id == bot.voice.connections.get(msg.guild.id).channel.id)
    {
      queue.get(msg.guild.id).songs.push(funcs.getStrValuesAfter(0, args));
      msg.channel.send(new discord.MessageEmbed().setColor("#00e600").setTitle("Добавлено")
      .setDescription("Трек " + funcs.getStrValuesAfter(0, args) + " добавлен в ваш плейлист"));
    }
    else
    {
      msg.channel.send(new discord.MessageEmbed().setColor("#ff0000").setTitle("Ошибка при остановке трека")
      .setDescription("Вы жолжны быть в одном голосовом канале для добавления"));
    }
  }
  else
  {
    msg.channel.send(new discord.MessageEmbed().setColor("#ff0000").setTitle("Ошибка при добавлении трека").setDescription("Воспроизведение не идёт"));
  }
}

function Stop(bot, msg, args)
{
  console.log(msg.guild.member(msg.author).voice.channel.id);

  console.log(bot.voice.connections.get(msg.guild.id).channel.id);

  if(queue.has(msg.guild.id))
  {
    if(msg.guild.member(msg.author).voice.channel.id == bot.voice.connections.get(msg.guild.id).channel.id)
    {
      // console.log(bot.voice.connections.get(queue.get(msg.guild.id).channel));
      queue.get(msg.guild.id).connection.disconnect();
      queue.delete(msg.guild.id);
    }
    else
    {
      msg.channel.send(new discord.MessageEmbed().setColor("#ff0000").setTitle("Ошибка при остановке трека").setDescription("Вы жолжны быть в одном голосовом канале для остановки"));
    }
  }
  else
  {
    msg.channel.send(new discord.MessageEmbed().setColor("#ff0000").setTitle("Ошибка при остановке трека").setDescription("Воспроизведение не идёт"));
  }
}

function Skip(bot, msg, args)
{
  if(queue.has(msg.guild.id))
  {
    if(queue.get(voiceChannel.guild.id).songs.length - 1 == queue.get(voiceChannel.guild.id).position)
    {
      msg.channel.send(new discord.MessageEmbed().setColor("#ff0000").setTitle("Ошибка при попуске трека")
      .setDescription("Невозможно пропустить трек, так как он является последним в вашей очереди"));
    }
    else
    {
      if(msg.guild.member(msg.author).voice.channel.id == bot.voice.connections.get(msg.guild.id).channel.id)
      {
        play(msg, queue.get(msg.guild.id).songs[queue.get(msg.guild.id).position]);
        queue.get(msg.guild.id).position += 1;
      }
      else
      {
        msg.channel.send(new discord.MessageEmbed().setColor("#ff0000").setTitle("Ошибка при пропуске трека")
        .setDescription("Вы жолжны быть в одном голосовом канале для пропуска"));
      }
    }
  }
}

async function Stream(voiceChannel, link, msg) {
  const connection = await voiceChannel.join();
  
  connection.play(ytdl(link, {filter:'audioonly'})).on('end', ()=>{console.log('ended')});
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
    {name: ["играть", "play"], out:start, ab:"Привнесёт веселья в вашу тусу! Введите название песни и музыка начнёт играть! Ю-ХУ! (Пока работает только на одном канале)"},
    {name: ["add", "добавить", "адд"], out:add, ab:"Создайте свой невероятный плейст, добавив в него трек вам по душе."},
    {name: ["стоп", "stop"], out:Stop, ab:"Остновите воспроизведение и закрйте плеер! Вечеринка закончилась."},
    {name: ["скип", "skip", "следущ", "пропуск", "пропустить"], out:Skip, ab:"\"Кто-нибудь, вырубите это №;!2\" - пропустите текущий трек с помощью этой команды"}
]

module.exports.commands = list;
module.exports.about = {name:["музыка", "плеер", "music"], about: "О да, наконец-то, блин, нормальная музыка! Подключите бота к своему голосовму каналу и запустите воспроизведение."};