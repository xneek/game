import React from "react";
import { useAppSelector } from "../../store/hooks";
import StepCard from "../StepCard";
import styles from './styles.module.css';

interface PlayingFieldProps {
    
}
 
const PlayingField: React.FC<PlayingFieldProps> = () => {
    const {  game } = useAppSelector((s) => s.game);

    React.useEffect(() => {
        document.title = game?.name ?? ''
    }, [game]);

    if (!game) {
        return <main style={{flexGrow: 2}}>Сконфигурируйте игру, и начнем</main>
    }

    const count = game.steps.length;
    let cols = Math.floor(count / 10);
    let rows = Math.floor(count / 10);

    if (count < 80) {
        cols = 8
        rows = Math.ceil(count / cols)
    }

    if (count < 50) {
        cols = 5
        rows = Math.ceil(count / cols)
    }

    if (count < 30) {
        cols = 3
        rows = Math.ceil(count / cols)
    }

    return (<main style={{flexGrow: 2}}>
        <div className={styles.playingField}>
            {game.steps.map((step, i)=> {
                return <StepCard key={step.id} step={step} number={i + 1} style={{ width: `calc(${(100 / cols)}% - 2px)`, height: `calc(${Math.floor(100 / rows)}% - ${rows}px)`}}  />
            })}
        </div>
    </main>);
}
 
export default PlayingField;