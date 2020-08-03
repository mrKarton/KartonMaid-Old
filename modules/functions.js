const { modules } = require("../moduler");

function getID(snake)
{
    var step1 = "";
    for(var i = 2; i < snake.length; i++)
    {
        step1 += snake[i];
    }
    var step2 = "";
    for(var i = 0; i < step1.length - 1; i ++)
    {
        step2 += step1[i];
    }
    return step2;
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

function isAdmin(member, guild, bot)
{
    return bot.guilds.cache.get(guild).member(member).hasPermission("ADMINISTRATOR");//get guild -> get member -> check premmissins
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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

// var exports = {getChannelID: getChannelID, getStrValuesAfter: getStrValuesAfter, getRandomInt: getRandomInt, isAdmin: isAdmin};

// module.exports = exports;

module.exports.getID = getID;
module.exports.getStrValuesAfter = getStrValuesAfter;
module.exports.getRandomInt = getRandomInt;
module.exports.isAdmin = isAdmin;
module.exports.getValuesAfter = getValuesAfter;