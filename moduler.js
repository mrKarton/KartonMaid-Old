var fun = require('./modules/fun.js');
var help = require('./modules/helping.js');
var voice = require('./modules/voice.js');
var RP = require('./modules/roleplay.js');
var Karton = require('./modules/karton')
var Adm = require('./modules/administrating');

var fullList = Array();

fullList.push({module: Adm.about, commands: Adm.commands});
fullList.push({module: help.about, commands: help.commands});
fullList.push({module: voice.about, commands: voice.commands});
fullList.push({module: fun.about, commands: fun.commands});



var commandList = Array();

module.exports.modules = fullList;
module.exports.commands = commandList.concat(Adm.commands, help.commands,  fun.commands,  voice.commands, RP.commands, Karton.commands);