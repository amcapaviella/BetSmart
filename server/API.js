const axios = require('axios');
const key = require('./keys.js');

//formats date for use in the url string below
const formatDate = (date) => {
    return date.substring(11, 15) + "-" + date.substring(4, 7) + "-" + date.substring(8, 10)
}

let date = formatDate(Date())

const url = `https://api.sportsdata.io/v3/cbb/stats/json/BoxScores/${date}`

//axios config
let config = {
    headers: {
        "Ocp-Apim-Subscription-Key": key
    }
}

//fetches college basketball data from sportsdata api and returns all games currently in progress
const fetchData = async (url) => {
    const myGames = await axios(url, config).
        then((results) => {
            return findInProgress(results.data);
        }).catch((error) => {
            console.log(error)
        })
    return myGames
}

//returns all games currently in progress
const findInProgress = (games) => {
    let inProgress = []
    for (var i = 0; i < games.length; i++) {
        if (games[i]["Game"]["Status"] === "InProgress") {
            inProgress.push(games[i])
        }
    }

    return inProgress;

}

// calls fetchData and stores all betting prospects
setInterval(() => {
    fetchData(url).then((data) => {
        console.log(data)
        console.log('there are ' + data.length + ' games live')
        return data
    })
}, 15000)

