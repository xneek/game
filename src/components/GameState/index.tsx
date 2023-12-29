import { HTMLAttributes } from "react";
import { Player, Step } from "../../store/gameStore/game.slice";
import styles from './styles.module.css'
import { useAppSelector } from "../../store/hooks";
import Avatar from "../Avatar";

interface GameStateProps extends HTMLAttributes<HTMLDivElement> {
}
 
const GameState: React.FC<GameStateProps> = ({...rest}) => {

    const { players, playerStatus, game,winners } = useAppSelector((s) => s.game);

    const playersWithScores: Array<Player & { score: number; count: number }> = players.map((p) => ({ ...p, score: playerStatus[p.id].score ?? 0, count: playerStatus[p.id].count ?? 0 })).sort((a, b) =>  b.score - a.score);

    return (<div {...rest} style={{flexGrow: 2}} >
        <div className={styles.gameState}>
        {playersWithScores.map((p)=> {
            return <div key={p.id} className={styles.item}>
                <Avatar src={p.photo} color={p.color} style={{ width: '0.8em', float: 'left', borderWidth: 0 }} />
                &nbsp;
                <small><b>{p.score}</b><sup><small>{p.count}</small></sup> - {p.name}</small>
                <div className={styles.progress} style={{ width: `${(p.score / (game?.steps.length || 1)) * 100}%`, backgroundColor: p.color }}></div>
            </div>
        })}
        </div>
        <div className={styles.winners}>
        {winners.length > 0 && winners.map((p, i)=> {
            return <div key={p.id} className={styles.winner}>
                <Avatar src={p.photo} color={p.color} style={{ width: '0.8em', float: 'left', borderWidth: 0 }} />
                &nbsp;
                <small><b>{i+1} место</b><sup><small>{p.count}</small></sup> - {p.name} ({new Date(p.date).toLocaleTimeString()})</small>
            </div>
        })}
        </div>
    </div>);
}
 
export default GameState;