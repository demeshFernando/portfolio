import NavStyles from './navbar.module.css';
import { usePortfolioModel } from '../Hooks/usePortfolioModel';

import Loader from '../Loader/Loader';

//#region types
export type NavBarProps = {
    Items: {
        ID: number;
        name: string;
        onClick: (sourceId: number) => void;
    }[];
    DisableNavBar: boolean;
};
type NavBarModelType = {
    ActiveIndex: number;
};
//#endregion

//#region Cmpnts
export default function NavBar(props: NavBarProps){
    const { model: navBarModel, helpers } = usePortfolioModel<NavBarModelType>({
        model: {
            ActiveIndex: 0,
        },
    });

    const onNavBarElClick = (elProps: { index: number, ID: number, navBarClickHandler: (sourceId: number) => void }) => {
        if(elProps.ID > 0 && !props.DisableNavBar) {
            helpers.binders.setToModel('ActiveIndex', elProps.index);
            elProps.navBarClickHandler(elProps.ID);
        }
    };

    const generatedElement = props.Items.map((item, index) => {
        if(navBarModel.ActiveIndex === index) {
            return <div
            key={item.ID}
            onClick={() => onNavBarElClick({ index, ID: item.ID, navBarClickHandler: item.onClick })}
            className={`${NavStyles['selectable']} ${NavStyles['indicator']}`}>{item.name}</div>;
        }
        return <div
         key={item.ID}
         onClick={() => onNavBarElClick({ index, ID: item.ID, navBarClickHandler: item.onClick })}
         className={`${NavStyles['selectable']}`}>{item.name}</div>;
    });

    let finalView = <div className={NavStyles['selectables']}>
        {generatedElement}
    </div>;

    if(props.DisableNavBar) {
        finalView = <><div className={NavStyles['selectables']}>
        {generatedElement}
    </div>&nbsp;
    <Loader size={20} /></>;
    }

    return <div className={NavStyles['selectables-overlay']}>
        {finalView}
    </div>;
}
//#endregion