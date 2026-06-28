import { useEffect, useRef, useState } from 'react';
import TypeTextStyles from './TypeText.module.css';

type TypeTextType = {
    Text: string;
    Font?: 'h1';
    Cursor?: boolean;
    Speed?: number;

    afterFinishTyping?: () => void;
};

export default function TypeText(props: TypeTextType) {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        setDisplayedText('');

        const interval = setInterval(() => {
            setDisplayedText(prev => prev + props.Text.charAt(indexRef.current));
            indexRef.current += 1;

            if(indexRef.current >= props.Text.length) {
                if(props.afterFinishTyping) {
                    props.afterFinishTyping();
                }
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [props]);

    if(props.Font) {
        switch (props.Font) {
            case 'h1': return <h1 className={TypeTextStyles.typing}>
                                {displayedText}
                                {props.Cursor && <span className={TypeTextStyles.cursor}></span>}
                            </h1>;
        }
    }

    return <div className={TypeTextStyles.typing}>
        {displayedText}
        {props.Cursor && <span className={TypeTextStyles.cursor}></span>}
    </div>;
}