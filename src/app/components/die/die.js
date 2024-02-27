import React from "react";
import styles from "./die.module.css"
import { Karla } from 'next/font/google';

const karla = Karla({
    subsets: ['latin'],
    weight: '800'
});

export default function Dice({ value, isHeld, holdDice }){

    return(
        <div className={!isHeld ? `${styles.divDie} ${karla.className}` : `${styles.divDie} ${karla.className} ${styles.divDieActive}`} onClick={holdDice}>
            {value}
        </div>
    )
}