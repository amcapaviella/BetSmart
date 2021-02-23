import React, { useState, useEffect } from 'react';
import { fetchData, url } from "../../server/API"



const App = () => {
    const [liveGames, setLiveGames] = useState([])

    //fetches college basketball live scores every 15 seconds 

    const updateLiveGames = (games) => {
        setLiveGames()
    }

    useEffect(() => {
        setInterval(() => {
            fetchData(url).then((data) => {
                console.log('there are ' + data.length + ' games live')
                updateLiveGames(data)
            }).then(() => {
                console.log(liveGames)
            })
        }, 15000)
    }, [])

    return (
        <div>
            {liveGames}
        </div>
    )
}

export default App