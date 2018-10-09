class team{
    constructor(id,name,venue,abbr,confrence,division,roster){
        this.id = id;
        this.name = name;
        this.venue = venue;
        this. abbr = abbr;
        this.confrence = confrence;
        this.division = division;
        this.roster = roster;
    }
}

class game{
    constructor(id,type,season,date,teams){
        this.id = id;
        this. type = type;
        this.season = season;
        this.date = date;
        this.teams = teams;
    }

}

class player{
    constructor(id,name,number,position,stats){
        this.id = id
        this.name = name
        this.number = number
        this.position = position
        this.stats = stats
    }
}

module.exports = {
    game : game,
    team : team,
    player : player
}