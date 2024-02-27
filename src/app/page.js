'use client'
import styles from "./page.module.css";
import React, {useState, useEffect} from "react";
import { Karla } from 'next/font/google';
import Dice from "./components/die/die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

const karla = Karla({
  subsets: ['latin'],
  weight: ['600', '800']
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

  const [winner, setWinner] = React.useState(false)
  const [dieList, setDieList] = useState(() => resetAll())
  const dieArray = dieList.map(dieNumber => <Dice key={dieNumber.id} value={dieNumber.value} isHeld={dieNumber.isHeld} holdDice={() => holdDice(dieNumber.id)}/>)
  
  useEffect(() => {
    if(dieList.every(dice => dice.value === dieList[0].value && dice.isHeld === true)){
      setWinner(true)
    } else {
      setWinner(false)
    }
  }, [dieList])

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
            <button onClick={()=>setDieList(resetAll)} className={`${styles.randomiseButton} ${karla.className}`}>
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
            <div className={styles.diceFrame}>
              {isClient && dieArray}
            </div>
            <button onClick={() => reRollIfNotHeld()} className={`${styles.randomiseButton} ${karla.className}`}> 
              Roll 
            </button>
          </> 
        )}
      </div>
    </main>
  );
}
