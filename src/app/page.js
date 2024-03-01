'use client'
import styles from "./page.module.css";
import React, {useState, useEffect} from "react";
import { Karla } from 'next/font/google';
import Dice from "./components/die/die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Timer from "./components/timer/timer";

const karla = Karla({
  subsets: ['latin'],
  weight: ['500','600', '800']
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() =>{
    setIsClient(true);
  }, [])

  const resetAll = () => {
    const numArray = allNewDice()
    const defaultArray = numArray.map(num => ({value: num, isHeld: false, id: nanoid()}))
    return defaultArray
  }

  const [allTimeSeconds, setAllTimeSeconds] = useState(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const activateOrDeactivateTimer = (activateOrDeactivate) => {
    if(!timerActive && activateOrDeactivate === true){
      setTimerActive(activateOrDeactivate)
    } else if(activateOrDeactivate === false){
      setTimerActive(activateOrDeactivate)
    }
  }
  const resetTimer = () => {
    setTimerActive(false)
    setTimerSeconds(0)
  }

  const [allTimeRoll, setAllTimeRoll] = useState(null)
  const [nOfRolls, setNOfRolls] = useState(0)
  const [winner, setWinner] = useState(false)
  const [dieList, setDieList] = useState(() => resetAll())
  const dieArray = dieList.map(dieNumber => <Dice key={dieNumber.id} value={dieNumber.value} isHeld={dieNumber.isHeld} holdDice={() => holdDice(dieNumber.id)} activeTimer={() => activateOrDeactivateTimer(true)}/>)
  
  useEffect(() => {
    if(dieList.every(dice => dice.value === dieList[0].value && dice.isHeld === true)){
      setWinner(true)
      activateOrDeactivateTimer(false)
    } else {
      setWinner(false)
    }
  }, [dieList])

  useEffect(() => {
    const bestScore = localStorage.getItem('bestScore')
    const bestTime = localStorage.getItem('bestTime')
    if(bestScore){
      setAllTimeRoll(bestScore)
    }
    if(bestTime){
      setAllTimeSeconds(bestTime)
    }
  }, [])

  useEffect(() => {
    if(winner === true){
      if(allTimeRoll === null || nOfRolls < allTimeRoll){
        localStorage.setItem('bestScore', nOfRolls)
        setAllTimeRoll(nOfRolls)
      }
      if(allTimeSeconds === null || timerSeconds < allTimeSeconds){
        localStorage.setItem('bestTime', timerSeconds)
        setAllTimeSeconds(timerSeconds)
      }
    }
  }, [winner])

  function allNewDice(){
    const diceArray = []
    for(let i = 0; i < 10; i++){
      diceArray.push(Math.floor((Math.random()*6))+1)
    }
    return diceArray
  }

  function reRollIfNotHeld(){
    setDieList(prevDice => {
      const newList = allNewDice();
      const resultList = []
      for(let i = 0; i < newList.length; i++){
        if(prevDice[i].isHeld){
          resultList.push(prevDice[i])
        } else{
          resultList.push({...prevDice[i], value:newList[i]})
        }
      }
      return resultList
    })
    setNOfRolls(prev => prev + 1);
  }

  function holdDice(clickId){
    setDieList(prevDice => prevDice.map(Dice => ({
      ...Dice,
      isHeld: clickId===Dice.id ? !Dice.isHeld : Dice.isHeld
    })))
  }

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  })
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <main className={styles.backgroundFrame}>
      <div className={styles.backgroundInnerFrame}>
        {winner ? (
          <>
            <Confetti width={windowSize.width} height={windowSize.height}/>
            <h1 className={styles.winText}>You Win!</h1>
            <h2 className={styles.rollWin}> It took you <strong>{nOfRolls}</strong> {nOfRolls == 1 ? " roll to win!" : " rolls to win!"} </h2>
            <button onClick={()=>{
              setDieList(resetAll)
              setNOfRolls(0)
              resetTimer()
              }
            } className={`${styles.randomiseButtonWon} ${karla.className}`}>
              Play Again
            </button> 
          </>
          ) : (
          <>
            <h1 className={`${styles.tenziesTitle}`}> 
              Tenzies 
            </h1>
            <h3 className={styles.tenziesDescription}> 
              Roll until all dice are the same. Click each die to freeze it at its currrent value between rolls. 
            </h3>
            <p className={styles.rollCounter}>
              Number of rolls taken: <strong>{nOfRolls}</strong>
            </p>
            {allTimeRoll !== null && <p className={styles.rollCounter}>
              Personal best score: <strong>{allTimeRoll}</strong>
            </p>}
            <div className={styles.diceFrame}>
              {isClient && dieArray}
            </div>
            <button onClick={() => reRollIfNotHeld()} className={`${styles.randomiseButton} ${karla.className}`}> 
              Roll 
            </button>
          </> 
        )}
        <Timer className={styles.timer} timerActive={timerActive} timerSeconds={timerSeconds} setTimerSeconds={setTimerSeconds} winner={winner}/>
        {allTimeSeconds !== null && <p className={styles.bestTime}>Personal fastest time: {Math.floor(allTimeSeconds / 60) >= 1 ? `${Math.floor(allTimeSeconds / 60)} mins, ${Math.floor(allTimeSeconds % 60)} secs`: `${Math.floor(allTimeSeconds % 60)} secs`}</p>}
      </div>
    </main>
  );
}
