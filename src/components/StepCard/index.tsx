import { HTMLAttributes } from "react";
import { Player, Step } from "../../store/gameStore/game.slice";
import styles from './styles.module.css'
import { useAppSelector } from "../../store/hooks";
import Avatar from "../Avatar";
import clsx from "clsx";

interface StepCardProps extends HTMLAttributes<HTMLDivElement> {
    step: Step;
    number: number;
}
 
const StepCard: React.FC<StepCardProps> = ({step, number, ...rest}) => {

    const { players, playerStatus, currentPlayer, currentDice, gameSettings } = useAppSelector((s) => s.game);

    const playersWithScores: Array<Player & { score: number }> = players.map((p) => ({ ...p, score: playerStatus[p.id].score ?? 1})).filter((p) => p.score === number);

    const currentCellHasCurrentPlayer = currentPlayer?.id && playerStatus[currentPlayer.id].score === number;


    return (<div
        {...rest}
        className={clsx(styles.stepCard, {
            [styles.current]: currentCellHasCurrentPlayer,
            [styles.positive]: currentPlayer && currentDice && number === playerStatus[currentPlayer.id].score + currentDice,
            [styles.negative]: currentPlayer && currentDice && gameSettings.allowBack && number === playerStatus[currentPlayer.id].score - currentDice,
        })}
        style={{...(rest.style || {}), ...(gameSettings.cardBg ? { backgroundImage: `url('${step.img}')`} : {})}}
        id={`game-field-${number-1}`}
    >
            <span className={styles.number}>
            {number} 
            </span>
            {gameSettings.cardText && <small className={styles.text}>{step.name}</small>}
            <div className={styles.players}>
                {playersWithScores.filter((p) => currentPlayer?.id !== p.id).map((p) => <Avatar src={p.photo} color={p.color} style={{width:  16}} title={p.name} id={p.id} key={p.id} />)}
            </div>
            <div className={styles.currentPlayer}>
                {currentCellHasCurrentPlayer && <Avatar src={currentPlayer.photo} color={currentPlayer.color} style={{width:  24}} title={currentPlayer.name} />}
            </div>
    </div>);
}
 
export default StepCard;