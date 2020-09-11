var conf = require('../conf.json')
var funcs = require ('./functions');
function setActivity(bot, msg, args)
{
    bot.user.setActivity(funcs.getStrValuesAfter(1, args), {type:Number(args[0])});
    console.log('called');
}

module.exports.commands = [
    {name: [["activity"], ["activity"]], out: setActivity, requedPremissons:["KARTON"]}
];
