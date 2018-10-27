require('dotenv').config();
const express = require('express');
const request = require('request');
const cors = require('cors')
const PORT = process.env.PORT;
const app = express();

const {
    team,
    teamStat
} = require('./NHLSchemas.js');

const statsapiNHL = 'https://statsapi.web.nhl.com';

app.use(cors())

app.get('/:teamID', (req, res, next) => {
    const id = req.params.teamID;
    let statResponse;
    let teamDataResponse;
    let teamRosterResponse;
    request(statsapiNHL.concat(`/api/v1/teams/${id}/stats`), {
        json: true
    }, (err, resp, body) => {
        if (err) return console.log(err);
        //console.log(body);
        statResponse = body;
        //res.status(200).send();
        
        request(statsapiNHL.concat(`/api/v1/teams/${id}`), {
                json: true
            },
            (err, resp, body) => {
                teamDataResponse = body.teams[0];
                
                request(statsapiNHL.concat(`/api/v1/teams/${id}/roster`), {
                    json: true
                }, (err, resp, body) => {
        
                    let teamData = new team(teamDataResponse.id, teamDataResponse.name, teamDataResponse.venue, teamDataResponse.abbreviation,
                        teamDataResponse.conference, teamDataResponse.division, body.roster);
                        
                        const teamStats = parseTeamStats(statResponse.stats);
                        var mixedTeamStats = composeTeamStats(teamData,teamStats);
                        res.status(200).send(mixedTeamStats); 
                })
                //console.log(body);
                if (err) return console.log(err);
               
               
                //const teamData = parseTeams(teamDataResponse.teams);

                
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