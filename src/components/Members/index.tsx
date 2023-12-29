import React, { FormEvent, MouseEvent, MouseEventHandler } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Player, addPlayer, deletePlayer, editPlayer } from "../../store/gameStore/game.slice";
import Avatar from "../Avatar";

import styles from './styles.module.css'
import { colors } from "../../const/colors";
import Modal from "../_ui-kit/Modal";
import TakePhoto from "../TakePhoto";
import { showModal } from "../_ui-kit/Modal/showModal";

interface MembersProps {
    
}

const MemberItem: React.FC<{ member: Player, onDelete: (id: string) => void, onEdit: () => void }> = ({ member, onDelete, onEdit }) => {
  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Удалить игрока \n ${member.name}?`)) return;
    onDelete(member.id)
  }
    return (
      <div className={styles.member} style={{ maxWidth: 48}}>
        <Avatar src={member.photo} style={{ width: 40 }} color={member.color} />
        <small className={styles.memberName} title={member.name}>{member.name}</small>
        <div className={styles.memberToolbar}>
          <button onClick={handleDelete} title="Удалить">🗑</button>
          <button onClick={onEdit} title="Редактировать">✎</button>
        </div>
      </div>
    )
}
 
const Members: React.FC<MembersProps> = () => {
    const addModalRef = React.useRef<HTMLDialogElement>(null);
    const { players } = useAppSelector((state) => state.game);
    const dispatch = useAppDispatch();

    const [takePhotoMode, setTakePhotoMode] = React.useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        const existingId = (document.getElementById('addMemberId') as HTMLInputElement).value || null;
        const id = performance.now().toString();
        const name = (document.getElementById('addMemberName') as HTMLInputElement).value || '';
        const photo = (document.getElementById('addMemberPhoto') as HTMLImageElement).src || '';

        if (existingId) {
          dispatch(editPlayer({ id: existingId, name, photo }));
        } else {
          dispatch(addPlayer({ id, name, photo, color: colors[players.length+1] }));
        }
        e.currentTarget.reset();
    }
    const handleReset = (e: FormEvent)=> {
      (document.getElementById('addMemberId') as HTMLInputElement).value = '';

        (document.getElementById('addMemberPhoto') as HTMLImageElement).src = `http://vk.com/images/gift/${100 + Math.round(Math.random() * 500)}/256.jpg`;
        addModalRef.current?.close()
    }
    const handleClickPhoto = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                const imageTypes = clipboardItem.types?.filter(type => type.startsWith('image/'));

                if (!imageTypes.length) {
                    alert('Сначала скопирует картинку в буфер обмена');
                }

                for (const imageType of imageTypes) {
                    const blob = await clipboardItem.getType(imageType);

                    const reader = new FileReader();
  
                    reader.onloadend = function() {
                      var base64data = reader.result;                
                      (document.getElementById('addMemberPhoto') as HTMLImageElement).src = base64data as string;
                    }

                    reader.readAsDataURL(blob);
                }
              }
          } catch (err) {
            console.error(err);
          }
    }

    const handleEdit = (player: Player) => {
      (document.getElementById('addMemberId') as HTMLInputElement).value = player.id;
      (document.getElementById('addMemberName') as HTMLInputElement).value = player.name;
      (document.getElementById('addMemberPhoto') as HTMLImageElement).src = player.photo;
      addModalRef.current?.showModal();
    }

    return (<div style={{ flexGrow: 2 }}>
      <header className={styles.membersHeader}>
        <h3 style={{ margin: 0 }}>Игроки ({players.length})</h3>
        <button onClick={() => addModalRef.current?.showModal()}>Добавить</button>
      </header>

        <div className={styles.membersContainer}>{players.map((p) => (
        <MemberItem member={p} key={p.id} onDelete={(id) => dispatch(deletePlayer(id))} onEdit={() => handleEdit(p)}/>
        ))}</div>
        <dialog ref={addModalRef} className={styles.modal}>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <header>
                  <h5 style={{ margin: 0 }}>Добавление/редактирование игрока</h5>
                </header>
                <main>
                  <input type="hidden" id="addMemberId" required autoFocus placeholder="Имя" />
                  <input name="name" id="addMemberName" required autoFocus placeholder="Имя" />
                  <br /><br />
                  <img id="addMemberPhoto" alt="Фотка"  width={80} height={80} src={`http://vk.com/images/gift/${100 + Math.round(Math.random() * 500)}/256.jpg`} />
                  
                  <button type="button" onClick={() => showModal((close) => <TakePhoto size={200} onTake={(s) => {
                    console.log(s);
                    
                    (document.getElementById('addMemberPhoto') as HTMLImageElement).src = s;
                    close();
                  }} />)}>Сфоткать</button>
                  <button type="button" onClick={handleClickPhoto}>Вставить фото из буфера</button>
                </main>
                <footer>
                  <input type="reset" value="Отмена" />
                  <input type="submit" value="Сохранить" />
                </footer>
                
            </form>
        </dialog>
       
    </div>);
}
 
export default Members;