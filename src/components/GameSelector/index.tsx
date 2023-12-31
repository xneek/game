import React from "react";
import { getAvailableGames } from "../../services/gamesService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { start } from "../../store/gameStore/game.slice";

interface GameSelectorProps {
    
}
 
const GameSelector: React.FC<GameSelectorProps> = () => {
    const games = getAvailableGames();

    const { players } = useAppSelector((s) => s.game)
    const dispatch = useAppDispatch();

    const handleStart = () => {
        const el = document.getElementById('gameSelect') as HTMLSelectElement;
        if (!el.value) {
            el.focus();
            return;
        }
        const roomEl = document.getElementById('roomId') as HTMLInputElement;

        // eslint-disable-next-line no-restricted-globals
        if (!players.length && !confirm('Начать без игроков?')) return;

        const game = games.find((g) => g.id === el.value);
        if (!game) throw new Error('Game is not found');

        if (roomEl.value.length) {
            game.roomId = roomEl.value;
        }

        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Начать игру «${game.name}»?`)) {
            dispatch(start(game));
        }

    }

    return (<div style={{ display: "flex", flexDirection:'column', gap: '8px' }}>
        <h3 style={{ margin: 0, display: 'flex', justifyContent:'space-between' }}>
            Выбрать игру
            <input size={6} placeholder='#id комнаты' id="roomId"/>
        </h3>
        <select id="gameSelect" defaultValue="">
        <option disabled value=""> -- Выбрать игру -- </option>
            {games.map((g) => {
                return <option value={g.id} key={g.id}>{g.name} ({g.steps.length} шаг(ов))</option>
            })}
        </select>
        <button onClick={handleStart}>Начать</button>
    </div>);
}
 
export default GameSelector;