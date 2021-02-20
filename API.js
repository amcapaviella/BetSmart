const axios = require('axios');
import keys from './keys.js'

const url = "https://api.sportsdata.io/v3/cbb/stats/json/BoxScores/2021-FEB-20"
<<<<<<< HEAD
const key = keys.sportsdataIOKey
=======
const key = "key"
>>>>>>> 95e12671523b92aa6e2686e57d67f31e7e8cf767

let config = {
    headers: {
        "Ocp-Apim-Subscription-Key": key
    }
}


//fetches collegebasketball data from sportsdata api and returns prospects for betting
const fetchData = async (url) => {
    await axios(url, config).
        then((results) => {
            const games = results.data
            const liveGames = findInProgress(games);
            const myGames = findProspects(liveGames);
            console.log(myGames)
        }).then((myGames) => {
            return myGames
        }).catch((error) => {
            console.log(error)
        })
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

//returns all games that have high number of fouls 
const findProspects = (liveGames) => {
    const prospects = []
    for (var i = 0; i < liveGames.length; i++) {
        const gameData = grabGameData(liveGames[i])
        const checkedGame = filterHighFouls(gameData);
        if (checkedGame === true) {
            prospects.push([gameData.homeTeam, gameData.homeFouls, gameData.awayTeam, gameData.awayFouls, gameData.minuteRemaining]);
        }

    }
    return prospects
}

//returns data object with game data (teams, fouls, time remaining)
const grabGameData = (game) => {
    const box = game["TeamGames"];
    const homeTeam = box[0]["Name"];
    const awayTeam = box[1]["Name"];
    const homeFouls = box[0]["PersonalFouls"];
    const awayFouls = box[1]["PersonalFouls"];
    const minuteRemaining = game["Game"]["TimeRemainingMinutes"];
    let data = { homeTeam: homeTeam, awayTeam: awayTeam, homeFouls: homeFouls, awayFouls: awayFouls, minuteRemaining: minuteRemaining };
    return data
}

//filters all games where fouls are greater than input - right now using 1 because sample data fouls are all low numbers - should be 5 or 6
const filterHighFouls = (gameData) => {
    if (gameData.homeFouls > 1 && gameData.awayFouls > 1) {
        return true
    } else {
        return false
    }
}

//calls fetchData and stores all betting prospects 
const finalProspects = fetchData(url)

//prints prospect list
console.log(finalProspects)


