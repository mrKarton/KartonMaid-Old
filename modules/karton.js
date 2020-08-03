var conf = require('../conf.json')

function log(bot, msg, args)
{
    if(msg.author.id == conf.karton)
    console.log(msg.content);
}

module.exports.commands = [
    {name: ["log"], out: log}
];
