import RotateStyles from './rotate.module.css';

import Icon from '../portfolioIcon/Icon';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type H3RotateType = {
    HeaderName: string;
    children: ReactNode;
    onOpenClick: () => void;
    onCloseClick?: () => void;
    IsActiveRotation?: boolean;
};

export default function H3Rotate(props: H3RotateType){
    const [isAngledDown, setIsAngledDown] = useState(true);
    const [refreshElement, setRefreshElement] = useState(0);
    const [isActiveRotation, setIsActiveRotation] = useState(true);
    const references = useRef({
        ShouldPropsFunctionsTrigerred: false,
    });

    const toggleRotation = () => {
        if(!isActiveRotation) return;
        references.current = { ShouldPropsFunctionsTrigerred: true };
        setIsAngledDown((prevAngleStatus) => !prevAngleStatus);
        setRefreshElement((prevCount) => prevCount++);
    };

    useEffect(() => {
        if(props.IsActiveRotation || props.IsActiveRotation === false) setIsActiveRotation(props.IsActiveRotation);
    }, [props.IsActiveRotation]);
    useEffect(() => {
        //we have to delay the function calls to finish the animations
        const timeout  = setTimeout(() => {
            if(isAngledDown && props.onCloseClick && references.current['ShouldPropsFunctionsTrigerred']) props.onCloseClick();
            if(!isAngledDown && references.current['ShouldPropsFunctionsTrigerred']) props.onOpenClick();
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isAngledDown, props]);

    return <>
        <div onClick={toggleRotation} className={RotateStyles.h3Header}>
        { isActiveRotation && <div key={refreshElement} className={`${!isAngledDown && isActiveRotation ? RotateStyles.down : RotateStyles.up}`}>
            <Icon icon='AngleDown' />
        </div> }
        <h3>{props.HeaderName}</h3>
    </div>
    {!isAngledDown && isActiveRotation && props.children}
    </>;
}