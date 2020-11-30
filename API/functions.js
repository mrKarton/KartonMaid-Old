
module.exports.GetUsers = (guildID, bot) => {
    var membersArr = new Array();
    bot.guilds.cache.get(guildID).members.cache.forEach((member)=>{
        membersArr.push({
            id:member.user.id,
            name:member.user.username,
            nickname:member.displayName,
            avatar:member.user.avatarURL(),
            roles:member.roles.cache.keyArray()
        })
    })

    return membersArr;
}

module.exports.guildID = (key) => {
    var list = require('./keys.json');
    var rtn = "404"
    list.forEach((elem)=>{
        console.log(elem.key == key);
        if(elem.key == key)
        {
            rtn = elem.id;
        }
    })

    return rtn;
}

