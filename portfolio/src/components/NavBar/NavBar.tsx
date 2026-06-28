import NavStyles from './navbar.module.css';
import { usePortfolioModel } from '../Hooks/usePortfolioModel';

import type { OutletCombinationsType } from '../../content/home/Home';
import { CommonLoader } from '../utils/CommonCmpnts';

//#region types
export type NavBarProps = {
    Items: OutletCombinationsType[];
    DisableNavBar: boolean;
    onClick: (sourceId: number) => void;
};
type NavBarModelType = {
    ActiveIndex: number;
};
//#endregion

//#region Cmpnts
export default function NavBar(props: NavBarProps) {
    const { model: navBarModel, helpers } = usePortfolioModel<NavBarModelType>({
        model: {
            ActiveIndex: 0,
        },
    });

    const onNavBarElClick = (elProps: { index: number, ID: number }) => {
        if (elProps.ID > 0 && !props.DisableNavBar && elProps.index !== navBarModel.ActiveIndex) {
            helpers.binders.setToModel('ActiveIndex', elProps.index);
            props.onClick(elProps.ID);
        }
    };

    const generatedElement = props.Items.map((item, index) => {
        if (navBarModel.ActiveIndex === index) {
            return <div
                key={item.OutletID}
                onClick={() => onNavBarElClick({ index, ID: item.OutletID })}
                className={`${NavStyles['selectable']} ${NavStyles['indicator']}`}>{item.Outlet}</div>;
        }
        return <div
            key={item.OutletID}
            onClick={() => onNavBarElClick({ index, ID: item.OutletID })}
            className={`${NavStyles['selectable']}`}>{item.Outlet}</div>;
    });

    let finalView = <div className={NavStyles['selectables']}>
        {generatedElement}
    </div>;

    if (props.DisableNavBar) {
        finalView = <><div className={NavStyles['selectables']}>
            {generatedElement}
        </div>&nbsp;
            <CommonLoader color='dark' size='small' /></>;
    }

    return <div className={NavStyles['selectables-overlay']}>
        {finalView}
    </div>;
}
//#endregion