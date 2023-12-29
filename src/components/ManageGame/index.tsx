import React, { FormEvent, HTMLAttributes } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { GameSettings, downloadStoreAsJSON, importStoreFromJSON, reset, start, updateGameSettings } from "../../store/gameStore/game.slice";
import styles from './styles.module.css';
import { removeFromStorage, setToStorage } from "../../helpers/storageHelper";
import { gameStorageKey } from "../../const/storageKeys";
import Modal from "../_ui-kit/Modal";
import Members from "../Members";

interface ManageGameProps extends HTMLAttributes<HTMLDivElement> {
    onSave(): void
}
 
const ManageGame: React.FC<ManageGameProps> = ({onSave, ...rest}) => {
    const { gameSettings } = useAppSelector((s) => s.game);
    const dispatch = useAppDispatch();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const elements = (e.currentTarget as any).elements as any;
        const gameSettings: GameSettings = {
            allowBack: !!elements.allowBack.checked,
            allowSkip: !!elements.allowSkip.checked,
            diceSpinMs: +elements.diceSpin.value,
            diceShowMs: +elements.diceShow.value,
            diceMin: +elements.diceMin.value,
            diceMax: +elements.diceMax.value,
            cardText: !!elements.cardText.checked,
            cardBg: !!elements.cardBg.checked,
            speakCurrentCard: !!elements.speakCurrentCard.checked,
        }

        dispatch(updateGameSettings(gameSettings));
        onSave();
    }

   
    return (<div {...rest} className={styles.manageGame}>
       <form onSubmit={handleSubmit}>
        <header>Настройки игры</header>
            <main>
                <fieldset>
                    <legend>Настройки хода</legend>
                    
                    <label><input type="checkbox" name="allowBack" defaultChecked={gameSettings.allowBack} /> Разрешить шагать назад</label>
                    <label><input type="checkbox" name="allowSkip" defaultChecked={gameSettings.allowSkip} /> Разрешить пропускать ход</label>

                </fieldset>

                <fieldset>
                    <legend>Кубик</legend>
                    
                    <label>
                        <small>Значения кубика</small><br />
                        <input type="number" name="diceMin" defaultValue={gameSettings.diceMin} max={50} min={0} required />
                        -
                        <input type="number" name="diceMax" defaultValue={gameSettings.diceMax} max={50} min={1} required />
                    </label>


                    <label>
                        <small>Сколько  крутить кубик</small><br />
                        <input type="number" name="diceSpin" defaultValue={gameSettings.diceSpinMs} max={99999} min={500} required /> мс
                    </label>
                    <label>
                        <small>Сколько  показывать результат</small><br />
                        <input type="number" name="diceShow"  defaultValue={gameSettings.diceShowMs} max={99999} min={500} required /> мс
                    </label>

                </fieldset>

                <fieldset>
                    <legend>Карточки игрового поля</legend>
                    
                    <label><input type="checkbox" name="cardText" defaultChecked={gameSettings.cardText} />Текст карточки</label>
                    <label><input type="checkbox" name="cardBg" defaultChecked={gameSettings.cardBg} />Фон карточки</label>

                </fieldset>

                <fieldset>
                    <legend>Голос</legend>
                    <label><input type="checkbox" name="speakCurrentCard" defaultChecked={gameSettings.speakCurrentCard} /> Озвучивать задание</label>
                </fieldset>

            </main>
            <footer>
                <input type="submit" value="Сохранить" />
            </footer>
       </form>
    </div>);
}
 
export default ManageGame;