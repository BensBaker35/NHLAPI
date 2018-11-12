require('dotenv').config();
const express = require('express');
const request = require('request');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT;
const app = express();

const {
    team,
    teamStat,
    player,
    birthInfo,
    goalieStat,
    playerStat
} = require('./NHLSchemas.js');

const statsapiNHL = 'https://statsapi.web.nhl.com';

app.use(cors())
app.use(morgan('tiny'))
app.get('/teams/:teamID', (req, res, next) => {
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

app.get('/players/:playerID',(req,res,next) =>{
    const id = req.params.playerID;
    
    request(statsapiNHL.concat(`/api/v1/people/${id}?expand=person.stats&stats=yearByYear`),{json: true}, (err,resp,body)=>{
    
        const person = body.people[0];
        let playerObj;
        if(person.primaryPosition.code == 'G'){
            let bday = getPlayerBirthDay(person);
            let goalieStats = getAllGoalieStats(person.stats[0].splits)
            playerObj = new player(person.id,person.fullName,person.primaryNumber,person.primaryPosition.abbreviation,goalieStats,bday);
            
        }
        else{
            let bday = getPlayerBirthDay(person);
            let playerStats = getAllPlayerStats(person.stats[0].splits);
            
            playerObj = new player(person.id,person.fullName,person.primaryNumber,person.primaryPosition.abbreviation,playerStats,bday);
        }
        res.status(200).send(playerObj);
    })
   
}) 


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

function getPlayerBirthDay(person){
    return new birthInfo(person.birthCity,person.birthStateProvince,person.birthCountry,person.birthDate)
}

function getAllPlayerStats(splits){
    let parsedStats = [];
    splits.forEach(e =>{
        let stats = e.stat;
        let ps = new playerStat(stats.assists,stats.goals,stats.pim,stats.games,stats.plusMinus || null,stats.hits || null,stats.shots || null,stats.bshots || null,e.team.name, e.season);
        
        parsedStats.push(ps);
    })
    return parsedStats
}

function getAllGoalieStats(splits){
    let parsedStats = [];
    splits.forEach(e => {
        let stats = e.stat;
        let gs;
        if(stats.savePercentage){
            gs = new goalieStat(e.season,stats.shutouts,stats.ties,stats.wins,stats.losses,stats.goalAgainstAverage,stats.savePercentage,stats.games,stats.goalsAgainst,e.team.name,stats.shotsAgainst);
        }
        else{
            gs = new goalieStat(e.season,stats.shutouts,stats.ties,stats.wins,stats.losses,stats.goalAgainstAverage,null,stats.games,stats.goalsAgainst,e.team.name,null);
        }
        parsedStats.push(gs);
    });
    return parsedStats;
}

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