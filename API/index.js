var express = require('express');
var app = express();
var fs = require('fs');
var fuinctions = require('./functions');
// var gets = require('./Pages/get');

var bot;

var APIwork = (botd) => {

    bot = botd;
    
    app.listen(7777);

    app.get('/', defaultPage);

    app.get('/get', (req, res) => {
        if(typeof req.query.key != 'undefined')
    {
        var id = fuinctions.guildID(req.query.key)
        
        if(id != "404")
        {
            var users = fuinctions.GetUsers(id, bot);
            console.log(users);
            var guild = require('../GuildConfigs/guilds/' + id + '.json');
            guild.user = users;
            guild.error = null;
            res.send(JSON.stringify(guild));
        }
        else
        {
            res.send({error:'key is wrong'})
        }
    }
    else
    {
        res.send({error:'not authorized'});
    }
    });

    function getBot()
    {
        return bot;
    }
}

module.exports.getBot = bot;

var defaultPage = (req, res) => {
    if(typeof req.query.key != 'undefined')
    {
        res.send(fuinctions.guildID(req.query.key));
    }
    else
    {
        res.send('Hello world in Maid API');
    }
}

module.exports = APIwork;
