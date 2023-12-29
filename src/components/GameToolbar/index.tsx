import React, { HTMLAttributes } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { downloadStoreAsJSON, importStoreFromJSON, reset, start } from "../../store/gameStore/game.slice";
import styles from './styles.module.css';
import { removeFromStorage, setToStorage } from "../../helpers/storageHelper";
import { gameStorageKey } from "../../const/storageKeys";
import Modal from "../_ui-kit/Modal";
import Members from "../Members";
import ManageGame from "../ManageGame";

interface GameToolbarProps extends HTMLAttributes<HTMLDivElement> {
}
 
const GameToolbar: React.FC<GameToolbarProps> = ({...rest}) => {
    const fileInpRef = React.useRef<HTMLInputElement>(null);
    const [showMembersModal, setShowMembersModal] = React.useState(false);
    const [showGameManageModal, setShowGameManageModal] = React.useState(false);
    const { game } = useAppSelector((s) => s.game);

    const dispatch = useAppDispatch();

    const handleManageMembers = () => {
        setShowMembersModal(c => !c)
    }

    const handleManageGame = () => {
        setShowGameManageModal(c => !c)
    }    

    const handleDownload = () => {
        dispatch(downloadStoreAsJSON())
    }
    const handleReset = () => {
                // eslint-disable-next-line no-restricted-globals
        if(confirm('Сбросить текущий прогресс и начать новую игру?')) {
            removeFromStorage(gameStorageKey)
            window.location.reload();
        } 
    }
    const handleImport = () => {
        fileInpRef.current?.click();
    }
    const handleRestart = () => {
        // eslint-disable-next-line no-restricted-globals
        game && confirm('Сбросить текущий прогресс и начать сначала?') && dispatch(start(game))
    }


    const onChangeFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const readJsonFile = (file: Blob) =>
        new Promise((resolve, reject) => {
          const fileReader = new FileReader()
      
          fileReader.onload = event => {
            if (event.target) {
              resolve(JSON.parse(event.target.result as string))
            }
          }
      
          fileReader.onerror = error => reject(error)
          fileReader.readAsText(file)
        })

        if (event.target.files) {
          const parsedData = await readJsonFile(event.target.files[0]);
          setToStorage(gameStorageKey, JSON.stringify(parsedData))
          window.location.reload();
        }
    }

    return (<div {...rest} className={styles.toolbar}>
        <input type="file" accept=".json,application/json" ref={fileInpRef} className={styles.hiddenInput} onChange={onChangeFileInput} />
        <button onClick={handleDownload}>Сохранить в файл</button>
        <button onClick={handleImport}>Загрузить из файла</button>
        <button onClick={handleRestart}>Начать сначала</button>
        <button onClick={handleReset}>Новая игра</button>
        <div style={{ display: 'flex', gap: 4, justifyItems: 'stretch', justifyContent: 'stretch' }}>
            <button onClick={handleManageMembers} style={{ width: '100%' }}>Игроки</button>
            <button onClick={handleManageGame} style={{ width: '100%' }}>🛠 Игра</button>
        </div>
        {showMembersModal && <Modal open={showMembersModal}><Members /><footer><button onClick={handleManageMembers}>Закрыть</button></footer></Modal>}
        {showGameManageModal && <Modal open={showGameManageModal}><ManageGame onSave={handleManageGame} /></Modal>}
    </div>);
}
 
export default GameToolbar;