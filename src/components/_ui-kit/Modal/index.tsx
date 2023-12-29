import React, { FormEvent, HTMLAttributes, MouseEvent, MouseEventHandler } from "react";

import styles from './styles.module.css';

interface ModalProps extends HTMLAttributes<HTMLDialogElement> {
  open?: boolean
}

const Modal: React.FC<ModalProps> = ({ children, open = false }) => {
    const addModalRef = React.useRef<HTMLDialogElement>(null);

    React.useEffect(() => {
      if (open) { addModalRef.current?.showModal() } else { addModalRef.current?.close() }
    }, [open])


    return (
        <dialog ref={addModalRef} className={styles.modal}>
            {children}
        </dialog>
       );
}
 
export default Modal;