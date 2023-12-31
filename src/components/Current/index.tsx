import React, { HTMLAttributes } from "react";
import { completeCurrent, throwDice } from "../../store/gameStore/game.slice";
import styles from './styles.module.css'
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Avatar from "../Avatar";
import Dice from "../Dice";
import { speak } from "../../helpers/speachHelper";

interface CurrentProps extends HTMLAttributes<HTMLDivElement> {
}
 
const Current: React.FC<CurrentProps> = ({...rest}) => {

    const {currentPlayer, playerStatus, players, game, currentDice, gameSettings } = useAppSelector((s) => s.game);
    const dispatch =  useAppDispatch();
    const score = currentPlayer ? playerStatus[currentPlayer.id].score || 0 : 0;
    const step = game?.steps[(score + currentDice) - 1];

    React.useEffect(() => {
        if (currentDice && gameSettings.speakCurrentCard && step && step.name) {
            speak(currentPlayer?.name + ' ' + step.name);
        }

    }, [step, gameSettings, currentPlayer, currentDice])

    if (!currentPlayer) return players.length === 0 ? <div><br />Ожидание игроков...<br /><br /></div> : <div>Has No currentPlayer</div>


    if (!step) return <div>Has No step</div>

    const handleThrowDice = (value: number) => {
        if (score + value > game.steps.length) {
            dispatch(completeCurrent(false));
            return;
        }
        dispatch(throwDice(value));
    }

    const handleDisapprove = () => {
        dispatch(completeCurrent(false));
    }
    
    const handleApprove = () => {
        dispatch(completeCurrent(true));
    }
    
    const handleSkip = () => {
        dispatch(completeCurrent(null));
    }
    return (<>
        
        <div className={styles.currentPlayer}>
            {currentPlayer.name}
            <div>
                <Avatar src={currentPlayer.photo} style={{width: 80}} color={currentPlayer.color} />
                </div>
            <mark>{score}</mark>
        </div>
        

        
        {currentDice 
          ? <div  className={styles.currentCard} style={{...(rest.style || {}), backgroundImage: `url('${step.img}')`}}>
          <p className={styles.text}>{step.name}</p>
          <div className={styles.footer}>
            {gameSettings.allowBack && <button onClick={handleDisapprove} title="Шагать назад">(-{currentDice}) ❌</button>}
            {gameSettings.allowSkip && <button onClick={handleSkip} title="Пропустить">(0) ⏭</button>}
            <button onClick={handleApprove} title="Шагать вперед">(+{currentDice}) ✅ </button>
          </div>
          
              
      </div>
          : <div className={styles.currentDice}>
            <Dice
                onResult={() =>{}}
                onComplete={handleThrowDice}
                min={gameSettings.diceMin}
                max={gameSettings.diceMax}
                spinMs={gameSettings.diceSpinMs}
                showMs={gameSettings.diceShowMs}
            >
                Бросить кубик
            </Dice>
        </div> }
    </>);
}
 
export default Current;