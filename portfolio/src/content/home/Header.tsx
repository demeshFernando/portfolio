import { useEffect } from 'react';

import { useBaseStorage } from '../../components/utils/mainContext';
import { usePortfolioModel } from '../../components/Hooks/usePortfolioModel';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import TopStyles from './header.module.css';

import NavBar, { type NavBarProps } from '../../components/NavBar/NavBar';
import MainHeader from '../../components/mainHeader/MainHeader';

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

//#region Collections
const headerNavs = [
    {
        ID: 1,
        Name: 'Software Engineer'
    },
    {
        ID: 2,
        Name: 'Undergraduate',
    }
];

async function fetchHeaderNavs (): Promise<{ ID: number, Name: string }[]> {
    return headerNavs;
}
//#endregion

//#region outer fns
function prepareNavs(functions: {[key: string]: (sourceId: number) => void;}, names: ({ ID: number, Name: string })[]): NavBarProps['Items'] {
    const navFunctions = Object.values(functions);
    const preparedItems: NavBarProps['Items'] = [];
    if(navFunctions.length && names.length && navFunctions.length === names.length) {
        //this function assumes that the order of functions array are in
        //correct order with the names

        names.forEach((name, index) => {
            preparedItems.push({
                ID: name.ID,
                name: name.Name,
                onClick: navFunctions[index],
            });
        });
    }
    return preparedItems;
}
//#endregion

//#region Cmpnts
export default function Header() {
  const { model: headerModel, helpers: headerHelpers } = usePortfolioModel<NavHeaderType>({ model: { LoadNavBar: false, Vision: '' } });
  const storage = useBaseStorage();

  const { collection: navItems, helpers: navHelpers } = usePortfolioCollection({
    collection: null,
    helperAttributes: {
        name: 'Classifications',
        fetchFn: fetchHeaderNavs,
    }
  });

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
  };

  useEffect(() => {
    if(!navItems) navHelpers.fetchCollection();
  }, [navHelpers, navItems]);

  let navContentView = navHelpers.nullOrEmptyViewHolder;
  if(navItems && navItems.length) {
    navContentView = [<NavBar key={'main-header-nav'} DisableNavBar={headerModel.LoadNavBar} Items={prepareNavs(navClickFnMapper, navItems)} />];
  }

  return <>
  <div className={TopStyles['header-wrapper']}>
    <div className={TopStyles['header-left']}>
        <div className={TopStyles['vision-header']}>Vision</div>
        <div className={TopStyles['vision-body']}>
        This is a text and I am thinking of developing the vision here. I just want to make sure that this header section is working fine and this is the testing phase of the webiste and this text will get changed and they will be altered according to the view later for now the website testing this dummy paragraph has been added here. just for fun. ignor the grammer mistakes you find here. or spelling mistakes because this para doesn't containt any meaning just a testing prop.
        </div>
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
  </div>
  <MainHeader EnableStatus={!headerModel.LoadNavBar} />
  </>;
}
//#endregion