import { HTMLAttributes } from "react";
import styles from './styles.module.css'
import React from "react";
import { Game, Player } from "../../store/gameStore/game.slice";
import wsService from "../../services/wsService";
import { setToStorage } from "../../helpers/storageHelper";
import { WSAction } from "../../@types/wsActions";

interface ClientProps extends HTMLAttributes<HTMLDivElement> {
    hash: string;
}
 
const Client: React.FC<ClientProps> = ({ hash, ...rest }) => {
    const [game, setGame] = React.useState<Game | null>(null);
    const [player, setPlayer] = React.useState<Player | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const elements = (e.target as any).elements as any;
        const nameInp = elements.name;
        const name = nameInp.value;

        wsService.start(hash, name);
        setToStorage('player', name);

        wsService.send(hash, { action: WSAction.RegisterUser, payload: { room: hash, name }})
    }

    return (<div {...rest} className={styles.client}>
        <div>
            {game ? <h1></h1> : <h4>Игра: {hash}</h4>}
                    {!player && <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Имя" required />
                <input type="submit" value="Войти" />
            </form>}
        </div>

        
    </div>);
}
 
export default Client;