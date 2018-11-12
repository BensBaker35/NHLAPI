require('dotenv').config()
const {
    game,
    team,
    player
} = require('./NHLSchemas.js')
const https = require('https')
const request = require('request')


const statsapiNHL = 'https://statsapi.web.nhl.com'
const recordsNHL = 'https://records.nhl.com/site/api/'


request(statsapiNHL.concat('/api/v1/teams/54/stats'), {
    json: true
}, (err, res, body) => {
    if (err) return console.log(err);
    console.log(body.stats[0].splits);

    if (body.teams) {
        parseTeams(body.teams)
    }
    if (body.dates) {
        parseSchedule(body.dates);
    }
    if (body.people) {
        parsePlayers(body.people)
    }
})

function parseSchedule(dates) {

    for (date of dates) {

        var games = date.games;

        for (gameD of games) {
            console.log(`Game number ${gameD.gamePk}`);
            let gameRec = new game(gameD.gamePk, gameD.gameType,
                gameD.season, gameD.gameDate, gameD.teams);

            console.log(gameRec);
        }
    }
}

function parseTeams(teams) {
    for (teamD of teams) {
        request(statsapiNHL.concat([teamD.link+'/roster']),{json:true},(err,res,body)=>{
            
            let t = new team(teamD.id, teamD.name, teamD.venue, teamD.abbreviation,
                teamD.conference, teamD.division,body.roster);
            console.log(t); 
        })
    }
}

function parsePlayers(players) {
    for (playerD of players) {
        let pl = new player(playerD.id, playerD.fullName, playerD.primaryNumber,
            playerD.primaryPosition.abbreviation, playerD.stats)
        console.log(pl)
        console.log(pl.stats[0].splits)
    }
}