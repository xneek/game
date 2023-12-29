import { HTMLAttributes } from "react";
import styles from './styles.module.css';
import clsx from "clsx";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
    color: string
}
 
const Avatar: React.FC<AvatarProps> = ({src, color,...rest}) => {
    return (<div {...rest} className={clsx(styles.ava, !src && styles.empty)} role="presentation" style={{ ...(rest.style || {}), backgroundImage: `url('${src}')`, borderColor: color  }} ></div>);
}
 
export default Avatar;