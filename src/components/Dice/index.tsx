import { HTMLAttributes } from "react";
import styles from './styles.module.css'
import React from "react";

interface DiceProps extends HTMLAttributes<HTMLDivElement> {
    min?: number;
    max?: number;
    spinMs?: number;
    showMs?: number;
    onComplete: (value: number) => void;
    onResult: (value: number) => void;
}
 
const Dice: React.FC<DiceProps> = ({onComplete,onResult, min = 1, max = 6, spinMs = 1000, showMs = 1000, children, ...rest}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState(0);

    const spinTimerRef = React.useRef<ReturnType<typeof setTimeout>>();
    const showTimerRef = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
        return () => {
            clearTimeout(spinTimerRef.current);
            clearTimeout(showTimerRef.current);
        }
    },[])

    const start = () => {
        clearTimeout(spinTimerRef.current);
        clearTimeout(showTimerRef.current);
        setIsLoading(true);

        spinTimerRef.current = setTimeout(() => {
            setIsLoading(false);
            const res = min + Math.floor(Math.random() * max);
            setResult(res);
            onResult(res);
            showTimerRef.current = setTimeout(() => {
                onComplete(res);
                setResult(0);
                setIsLoading(false);
            }, showMs)
        }, spinMs);
    }

    const seq = React.useMemo(() => {
        const res = [];
        for(let i = min; i <= max; i++) {
            res.push(i);
        }
        return res.join('\n')
    }, [min, max])

    return (<div {...rest} className={styles.dice}>
        {isLoading && <div className={styles.loading} data-nums={seq} />}
        {result ? <strong className={styles.diceResult}>{result}</strong> : isLoading ? null: <button onClick={start} disabled={isLoading}>{
            children
        }</button>}
    </div>);
}
 
export default Dice;