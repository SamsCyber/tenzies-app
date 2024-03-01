import React, {useEffect, useState} from "react";

export default function Timer( {className, timerActive, timerSeconds, setTimerSeconds, winner} ){

    useEffect(() => {
        let intervals = null;
        if(timerActive){
                intervals = setInterval(() => {
                setTimerSeconds(seconds => seconds + 1)
            }, 1000)
        } else if (!timerActive && timerSeconds !== 0) {
            console.log("running")
            clearInterval(intervals)
        }

        return () => clearInterval(intervals)
    }, [timerActive])
    
    return(
        <div className={className}>
            {winner && !timerActive ? "Completed in: " : "Time Elapsed: "}
            {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
            {Math.floor((timerSeconds % 60)).toString().padStart(2, '0')}
        </div>
    )


}