import ReactDOM from 'react-dom/client';
import styles from './styles.module.css'
type rf = (close: () => void) => React.ReactNode;

export const showModal = (children: React.ReactNode | rf) => {


    const el = document.createElement('div');
    const root = ReactDOM.createRoot(el as HTMLElement);

    const handleClose = () => {
        root.unmount();
        document.body.removeChild(el);
    }

    
    root.render(<dialog ref={(e) => {e?.showModal()}} className={styles.modal} onClose={handleClose}>
        {typeof children === 'function' ? children(handleClose) : children}
    </dialog>);


    document.body.appendChild(el);
}