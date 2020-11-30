var fs = require('fs');

var getGuild = (id) =>{
    var guilds = JSON.parse(fs.readFileSync('configurations/guilds-data.temp'));

    var IdArr = new Array();

    guilds.forEach(guild => {
        IdArr.push(guild.ID);
    });

    if(IdArr.indexOf(id) == -1)
    {
        return 0;
    }
    else
    {
        return guilds[IdArr.indexOf(id)];
    }
}

var setGuild = (n_guild) =>{
    var guilds = JSON.parse(fs.readFileSync('configurations/guilds-data.temp'));

    var IdArr = new Array();

    guilds.forEach(guild => {
        IdArr.push(guild.ID);
    });

    if(IdArr.indexOf(n_guild.ID) != -1)
    {
        guilds[IdArr.indexOf(n_guild.ID)] = n_guild;
    }

    fs.writeFileSync('configurations/guilds-data.temp', JSON.stringify(guilds));
}


module.exports.get = getGuild;
module.exports.set = setGuild;