import { useEffect, useState } from 'react';
import fadeInStyles from './fadeInStyles.module.css';

type FadeInPropsType = {
    Text: string;
};

export function FadeIn(props: FadeInPropsType) {
    const [displayText, setDisplayText] = useState('');
    const [key, setKey] = useState(0);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setDisplayText(props.Text);
            setKey(prev => ++prev);

            clearTimeout(timeOut);
        }, 500);

        return () => clearTimeout(timeOut);
    }, [props]);

    return <span className={fadeInStyles['fade-in']} key={key}>{displayText}</span>;
}