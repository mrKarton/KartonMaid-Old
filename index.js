const discord = require('discord.js');  //
const bot = new discord.Client();       // connecting to discord
const config = require('./conf.json');  // loading configuration from conf.json

bot.on('ready', ()=> {
    console.log('Bot is ready to use.');// when bot is ready, message it
    bot.generateInvite(["ADMINISTRATOR"]).then((link)=>{console.log("My link: " + link)});//when invition link created, messgae it
});

bot.login(config.token); //logining with token from config

bot.on('message', (message)=>{  //adding message listener

    var cnt = message.content.split(' ');
    if(cnt.indexOf("<@471976309598322700>") != -1 && message.author.id != "471976309598322700" && getRandomInt(0, 100) % 4 == 0)
    {
        message.reply("Эйэйэйэйэй картона нельзя пинговать, ты что, забыл?? ;(")
    }

    if(cnt.indexOf("<@688060877395722338>") != -1 && message.author.id == "705017062933659679")
    {
        message.reply("иди нахуй, ты дракон с сатурна");
    }

    if(message.content.startsWith(config.prefix));  // checking messages for starting with prefix
    {
        var commands = splitForBot(message.content);
        if(commands != 0)                           // NOTICE: If cannot split message function returns 0
        {
            switch(commands[0])
            {
                case "make_embed":
                    if(bot.guilds.cache.get(message.guild.id).member(message.author).permissions.has("ADMINISTRATOR"))
                    {
                        bot.guilds.cache.get(message.guild.id).channels.cache.get(getChannelID(commands[1]))
                        .send(messageEmbed(commands, message.author));
                    }
                break;

                case "мем":
                case "meme":
                    //#region memes


                    message.channel.send("Подождите пару секунд..");

                    var request = require('request');

                    var URL = 'https://meme-api.herokuapp.com/gimme';
                    
                    request(URL, function (err, res, body) {
                        if (err) throw err;
                        var Data = JSON.parse(body);
                        var Heads = [
                            "Мемы мои мемы",
                            "Хотел пивас а получил МЕМАС",
                            "Мой смысл жизни - мемы, мемы",
                            "Шутка юмора",
                            "Еш"
                        ];
                        var Head = Heads[getRandomInt(0, Heads.length)];
                
                        var em = new discord.MessageEmbed().setImage(Data.url)
                        .setURL(Data.postLink)
                        .setAuthor(Data.subreddit, "https://i.pinimg.com/736x/db/a1/39/dba13992aa33c33e549c4ef9fbb7effe.jpg")
                        .setTitle(Data.title).setColor("#42aaff").setFooter(Head);

                        message.channel.send(em);
                    });
                        
                    //#endregion
                break;

                case "орёлирешка":
                case "headsntails":
                case "монета":
                    var out = " ";

                    if(getRandomInt(0, 100) % 2 == 0)
                    {
                        out = "Орёл";
                    }

                    else
                    {
                        out = "Решка";
                    }

                    message.reply(out);
                break;

                case "монеточка":

                break;

                case "коала":
                case "koala":
                    message.channel.send(getCoala());
                break;
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

function isAdmin(member, guild)
{
    return bot.guilds.cache.get(guild).member(member).hasPermission("ADMINISTRATOR");//get guild -> get member -> check premmissins
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getStrValuesAfter(it, arrr)
{
    var rtn = " ";
    for( var i = it; i < arrr.length; i++)
    {
        rtn += (arrr[i]) + " ";
    }
    return rtn;
}

function messageEmbed(cntn, user)
{

    console.log(cntn);
    console.log(user);
    var em = new discord.MessageEmbed().setColor(cntn[2]).setTitle(cntn[3]).setDescription(getStrValuesAfter(4, cntn))
    .setAuthor(user.username, user.avatarURL());

    console.log(em);

    return em;
}

function getChannelID(snake)
{
    var step1 = "";
    for(var i = 2; i < snake.length; i++)
    {
        step1 += snake[i];
    }
    console.log(step1);
    var step2 = "";
    for(var i = 0; i < step1.length - 1; i ++)
    {
        step2 += step1[i];
    }
    console.log(step2);
    return step2;
}

function getCoala()
{
    var URLs = [
        "https://uznayvse.ru/images/stories2016/uzn_1481216689.jpg",
        "https://i.imgur.com/jvAfbII.jpeg",
        "https://i.imgur.com/WYz8uPA.gif",
        "https://img3.goodfon.ru/wallpaper/nbig/a/cb/koala-sumchatoe-avstraliya-5312.jpg",
        "https://cdn.fishki.net/upload/post/2016/04/29/1936190/1446122581-45.jpg",
        "https://www.1zoom.ru/big2/450/305570-blackangel.jpg",
        "https://cdn.fishki.net/upload/post/201503/17/1467388/IR0XSUROobY.jpg"
    ];

    var URL = URLs[getRandomInt(0, URLs.length)];

    var Phrases = [
        "UwU",
        "ОЙ А КТО ТУТ МОЯ ХОРОШАЯ БУЛОЧКА??",
        "Зовите Картона, у нас тут просто Няшка-обоняшка!",
        "Вы только взгляните на эту сладкую булочку",
        "AWW"
    ];

    var Phrase = Phrases[getRandomInt(0, Phrases.length)];

    var Heads = [
        "Вот вам ваша коала..",
        "Это вы заказывали дозу умиления и нежности?",
        "О да, это коала!"
    ];

    var Head = Heads[getRandomInt(0, Heads.length)]

    var em = new discord.MessageEmbed().setTitle(Head).setFooter(Phrase).setImage(URL).setColor("#42aaff");

    return em;
}

//#region get-memes

function getMeme()
{
    
}

function getMemeJson()
{
   
}

////#endregion