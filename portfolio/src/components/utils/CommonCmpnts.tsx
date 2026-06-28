import Loader from '../Loader/Loader';
import { configs } from './application.config';

export function CommonLoader(props: { size?: 'small' | 'medium' | 'large', color?: 'dark' | 'light' } = { size: 'medium', color: 'light' }) {
    let numSize = 35; // medium size
    const color = configs.DarkGreen; // dark size color
    switch (props.size) {
        case 'small': numSize = 20; break;
        case 'large': numSize = 50; break;
        default: numSize = 35; break;
    }

    if (props.color === 'light') return <Loader color='white' size={numSize} />;
    return <Loader color={color} size={numSize} />;
}