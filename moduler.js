var fun = require('./modules/fun.js');
var help = require('./modules/helping.js');
var voice = require('./modules/voice.js');

var fullList = Array();

fullList.push({module: fun.about, commands: fun.commands});
fullList.push({module: voice.about, commands: voice.commands});
fullList.push({module: help.about, commands: help.commands})

var commandList = Array();

module.exports.modules = fullList;
module.exports.commands = commandList.concat(fun.commands, help.commands, voice.commands);