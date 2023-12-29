import React from "react";
import { useAppSelector } from "../../store/hooks";
import GameSelector from "../GameSelector";
import Members from "../Members";
import styles from './styles.module.css'
import Current from "../Current";
import GameState from "../GameState";
import GameToolbar from "../GameToolbar";

interface FooterFieldProps {
    
}
 
const Footer: React.FC<FooterFieldProps> = () => {
    const { startDate } = useAppSelector((state) => state.game)
    return (<footer>
        {!startDate && <div className={styles.prepareFooter}>
            <Members />
            <GameSelector />
       </div>}

       {startDate && <div className={styles.prepareFooter}>
            <Current />
            <GameState />
            <GameToolbar />
       </div>}
    </footer>);
}
 
export default Footer;