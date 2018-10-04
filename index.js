const https = require('https')
const request = require('request')



request('https://statsapi.web.nhl.com/api/v1/teams',{json:true}, (err,res,body) => {
    if(err) return console.log(err);
    console.log(body)
    
    
})
