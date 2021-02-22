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

//static "user inputs". - update to take user inputs from front end
const userInputs = {
    homeFouls: 0,
    awayFouls: 0,
    minutesRemaining: 12,
    scoreDifferential: [3, 8]
}


//returns all games that have high number of fouls 
const findProspects = (liveGames) => {
    const prospects = []
    for (var i = 0; i < liveGames.length; i++) {
        const gameData = grabGameData(liveGames[i])
        const checkedGame = filterGames(gameData, userInputs);
        if (checkedGame === true) {
            prospects.push([gameData.homeTeam, gameData.homeFouls, gameData.awayTeam, gameData.awayFouls, gameData.minuteRemaining]);
        }

    }
    return prospects
}

//returns data object with game data (teams, fouls, time remaining)
const grabGameData = (game) => {
    const box = game["TeamGames"];
    const gameData = game["Game"];
    const homeTeam = box[0]["Name"];
    const awayTeam = box[1]["Name"];
    const homeFouls = box[0]["PersonalFouls"];
    const awayFouls = box[1]["PersonalFouls"];
    const awayScore = gameData["AwayTeamScore"];
    const homeScore = gameData["HomeTeamScore"];
    const minuteRemaining = game["Game"]["TimeRemainingMinutes"];

    let data = { homeTeam: homeTeam, awayTeam: awayTeam, homeFouls: homeFouls, awayFouls: awayFouls, minuteRemaining: minuteRemaining, awayScore: awayScore, homeScore: homeScore };
    return data
}


//filters all games where fouls are greater than input - right now using 1 because sample data fouls are all low numbers - should be 5 or 6
const filterGames = (gameData, userInputs) => {
    if (gameData.homeFouls >= 0 && gameData.awayFouls >= 0) {
        // console.log(gameData)
        return true
    } else {
        return false
    }
}



// calls fetchData and stores all betting prospects
const finalProspects = fetchData(url).then((data) => {
    console.log(data)
})




