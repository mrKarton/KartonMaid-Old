
class Guild
{
    constructor(id, prefix, language)
    {
        this.id = id;
        this.prefix = prefix;
        this.language = language;
        this.closedModules = Array();

        this.statEnabled = false;
        this.statChannels = [];
    }
}

module.exports = Guild;