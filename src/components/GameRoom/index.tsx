import React, { HTMLAttributes } from "react";
import { useAppSelector } from "../../store/hooks";
import styles from './styles.module.css';
import wsService from "../../services/wsService";

interface GameRoomProps extends HTMLAttributes<HTMLDivElement> {
}
 
const GameRoom: React.FC<GameRoomProps> = ({...rest}) => {
    const { game } = useAppSelector((s) => s.game);

    React.useEffect(() => {
        if (!game || !game.roomId) return;
        wsService.start(game.roomId, 'author');
    }, [game])

    if (!game || !game.roomId) {
        return null;
    }

    return (<div {...rest} className={styles.room}>
        {game.roomId}
        <img src={`//chart.apis.google.com/chart?cht=qr&chs=100x100&chl=${encodeURIComponent(`${window.location.href}#${game.roomId}`)}`} />
    </div>);
}
 
export default GameRoom;