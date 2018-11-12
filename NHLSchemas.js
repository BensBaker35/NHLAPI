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
    constructor(id,name,number,position,stats, bDay){
        this.id = id
        this.name = name
        this.number = number
        this.position = position
        this.stats = stats
        this.bDay = bDay
    }
}

class teamStat{
    constructor(name, wins,losses,pts,ot){
        this.name = name;
        this.wins = wins;
        this.losses = losses;
        this.pts = pts;
        this.ot = ot
    }
}

class birthInformation{
    constructor(cty,stPr,cntry,date){
        this.cty = cty
        this.stPR = stPr
        this.cntry = cntry
        this.date = date
    }
}

class goalieStat{
    constructor(season,sot,ties, wins, losses,gaa,svp,gms,goalsAgainst,teamName,shots){
        this.season = season
        this.sot = sot
        this.ties = ties
        this.wins = wins
        this.losses = losses
        this.gaa = gaa
        this.gms = gms
        this.goalsAgainst = goalsAgainst
        this.teamName = teamName
        this.svp = svp
        this.shots = shots
        this.saves = this.shots - this.goalsAgainst
    }
}

class playerStat{
    constructor(assists,goals,pim,games,plusMinus,hits,shots,bshots,teamName,season){
        this.assists = assists
        this.goals = goals
        this.pim = pim
        this.games = games
        this.plusMinus = plusMinus
        this.hits = hits
        this.shots = shots
        this.bshots = bshots
        this.points = goals + assists
        this.teamName = teamName
        this.season = season
    }
}

module.exports = {
    game : game,
    team : team,
    player : player,
    teamStat : teamStat,
    birthInfo : birthInformation,
    goalieStat: goalieStat,
    playerStat : playerStat
}