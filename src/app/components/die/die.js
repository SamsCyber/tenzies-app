import React from "react";
import styles from "./die.module.css"
import { Karla } from 'next/font/google';
import Dot from "../dieDot/dieDot";
import { nanoid } from "nanoid";

const karla = Karla({
    subsets: ['latin'],
    weight: '800'
});

export default function Dice({ value, isHeld, holdDice }){

    const dotArray = []
    for(let i = 0; i < value; i++){
        dotArray.push(<Dot key={nanoid()}/>)
    }

    return(
        <div className={!isHeld ? `${styles.divDie} ${karla.className}` : `${styles.divDie} ${karla.className} ${styles.divDieActive}`} onClick={holdDice}>
            {dotArray}
        </div>
    )
}