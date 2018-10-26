require('dotenv').config();
const express = require('express');
const request = require('request');

const PORT = process.env.PORT;
const app = express();

const {
    team,
    teamStat
} = require('./NHLSchemas.js');

const statsapiNHL = 'https://statsapi.web.nhl.com';


app.get('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    let body1;
    let body2;
    request(statsapiNHL.concat(`/api/v1/teams/${id}/stats`), {
        json: true
    }, (err, resp, body) => {
        if (err) return console.log(err);
        //console.log(body);
        body1 = body;
        //res.status(200).send();
        
        request(statsapiNHL.concat(`/api/v1/teams/${id}`), {
                json: true
            },
            (err, resp, body) => {
                //console.log(body);
                if (err) return console.log(err);
                body2 = body;
               
                const teamData = parseTeams(body2.teams);
                console.log('HI' + teamData)
                const teamStats = parseTeamStats(body1.stats);
                console.log(teamStats);
                var mixedTeamStats = composeTeamStats(teamData,teamStats);
                res.status(200).send(mixedTeamStats); 
            })
    })

})




app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

function parseTeams(teams) {
    //console.log(teams);
    
        teamD = teams[0];
        request(statsapiNHL.concat([teamD.link + '/roster']), {
            json: true
        }, (err, res, body) => {

            let t = new team(teamD.id, teamD.name, teamD.venue, teamD.abbreviation,
                teamD.conference, teamD.division, body.roster);
            //console.log('parsed team');
            //console.log(t); 
            return t;
        })
       
}

function parseTeamStats(stats) {
    var stat = stats[0].splits[0];

    let s = new teamStat(stat.team.name,
        stat.stat.wins, stat.stat.losses, stat.stat.pts, stat.stat.ot);
    return s;
}

function composeTeamStats(teamData,teamStats){
    
    const completeTeamData = {
        name: teamData.name,
        venue: teamData.venue,
        abbreviation: teamData.abbreviation,
        conference: teamData.confreence,
        division: teamData.division,
        roster: teamData.roster,
        wins: teamStats.wins,
        losses: teamStats.losses,
        pts: teamStats.pts,
        otl: teamStats.ot,
        id: teamData.id
    }
    return completeTeamData;
}