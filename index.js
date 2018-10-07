require('dotenv').config()
const {
    game,
    team,
    player
} = require('./NHLSchemas.js')
const https = require('https')
const request = require('request')


const statsapiNHL = 'https://statsapi.web.nhl.com/api/v1/'
const recordsNHL = 'https://records.nhl.com/site/api/'


request(statsapiNHL.concat('people/8477949/stats'), {
    json: true
}, (err, res, body) => {
    if (err) return console.log(err);
    console.log(body);

    if (body.teams) {
        parseTeams(body.teams)
    }
    if (body.dates) {
        parseSchedule(body.dates);
    }



})

function parseSchedule(dates) {
    //var dates = body.dates;

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
        console.log(teamD.franchise);
        let t = new team(teamD.id, teamD.name, teamD.venue, teamD.abbreviation,
            teamD.conference, teamD.division);
        console.log(t);
    }
}