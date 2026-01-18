import { useBaseStorage } from '../../components/utils/mainContext';
import { usePortfolioModel } from '../../components/Hooks/usePortfolioModel';
import TopStyles from './header.module.css';
import type { OutletCombinationsType } from './Home';

import NavBar, { type NavBarProps } from '../../components/NavBar/NavBar';

//#region types
type NavHeaderType = {
    LoadNavBar: boolean;
    Vision: string;
};

export type MainNavType = {
    ID: number;
    Name: string;
};
//#endregion

//#region outer fns
function prepareNavs(functions: {[key: string]: (sourceId: number) => void;}, names: OutletCombinationsType[]): NavBarProps['Items'] {
    const preparedItems: NavBarProps['Items'] = [];
    const filteredValues = names.filter((outlet, index, self) => {
        return index === self.findIndex(o => o.Outlet === outlet.Outlet);
    });
    filteredValues.forEach((name) => {
        preparedItems.push({
            ID: name.OutletID,
            name: name.Outlet,
            onClick: functions[name.Outlet],
        });
    });
    return preparedItems;
}
//#endregion

//#region Cmpnts
export default function Header(props: { OutletData: OutletCombinationsType[] }) {
  const { model: headerModel, helpers: headerHelpers } = usePortfolioModel<NavHeaderType>({ model: { LoadNavBar: false, Vision: '' } });
  const storage = useBaseStorage();

  const navClickFnMapper = {
    'Software Engineer': (sourceId: number) => {
        headerHelpers.binders.setToModel('LoadNavBar', true);
        storage?.Push('SourceID', sourceId);
        setTimeout(() => headerHelpers.binders.setToModel('LoadNavBar', false), 10000);
    },
    'Undergraduate': (sourceId: number) => {
        headerHelpers.binders.setToModel('LoadNavBar', true);
        storage?.Push('SourceID', sourceId);
        setTimeout(() => headerHelpers.binders.setToModel('LoadNavBar', false), 10000);
    },
    'General': (sourceId: number) => {
        headerHelpers.binders.setToModel('LoadNavBar', true);
        storage?.Push('SourceID', sourceId);
        setTimeout(() => headerHelpers.binders.setToModel('LoadNavBar', false), 10000);
    },
  };

  const navContentView = [<NavBar key={'main-header-nav'} DisableNavBar={headerModel.LoadNavBar} Items={prepareNavs(navClickFnMapper, props.OutletData)} />];

  return <div className={TopStyles['header-wrapper']}>
        <div className={TopStyles['header-left']}>
            <div className={TopStyles['vision-header']}>Vision</div>
            <div className={TopStyles['vision-body']}>{storage?.getConfigItem('Vision')}</div>
        </div>
        <div className={TopStyles['header-right']}>
            <div className={TopStyles['greeting-header']}>
                <div className={TopStyles['owner-greeting']}>Hi! there, I'm</div>
                <div className={TopStyles['owner-name']}>{storage?.getConfigItem('PortfolioUserName')}</div>
                <div className={TopStyles['owner-position']}>Trainee Software Engineer</div>
            </div>
            <div className={TopStyles['pathway']}>
                <div className={TopStyles['pathway-header']}>My work as a,</div>
                {navContentView}
            </div>
        </div>
    </div>;
}
//#endregion