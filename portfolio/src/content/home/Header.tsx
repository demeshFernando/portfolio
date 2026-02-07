import { useBaseStorage } from '../../components/utils/mainContext';
import { usePortfolioModel } from '../../components/Hooks/usePortfolioModel';
import TopStyles from './header.module.css';
import type { OutletCombinationsType } from './Home';
import { useEffect, useState } from 'react';
import { HomeAPI } from '../../controllers/HomeController';

import NavBar, { type NavBarProps } from '../../components/NavBar/NavBar';
import { Carausel, CarauselContent, CarauselDots } from '../../components/Caraousel/Caraousel';
import { images } from '../../components/Caraousel/testImage';

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
function UserPosition(){
    const [position, setPosition] = useState({
        PositionID: 0,
        Position: '',
    });
    useEffect(() => {
        const fetchPositions = async() => {
            try {
                const result = await HomeAPI.latestUserPositionGet();
                setPosition(result);
            } catch {
                // let's ignore the error for now
            }
        };
        fetchPositions();
    }, []);

    if(position.PositionID && position.Position) {
        return <div className={TopStyles['owner-position']}>{position.Position}</div>;
    }
    return null;
}

const tempCarauselDataHolder = [
    {
        ID: 1,
        Img: images.Bird,
        Header: 'Jhon Doe',
        SubHeader: 'Front end developer',
        Body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    },
    {
        ID: 2,
        Img: images.Bird,
        Header: 'Jhon Doe',
        SubHeader: 'Front end developer',
        Body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    },
    {
        ID: 3,
        Img: images.Bird,
        Header: 'Jhon Doe',
        SubHeader: 'Front end developer',
        Body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    },
    {
        ID: 4,
        Img: images.Bird,
        Header: 'Jhon Doe',
        SubHeader: 'Front end developer',
        Body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    },
    {
        ID: 5,
        Img: images.Bird,
        Header: 'Jhon Doe',
        SubHeader: 'Front end developer',
        Body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    },
];

function CarauselHandler() {
    const carausel = new Carausel(tempCarauselDataHolder);
    const carauselModel = usePortfolioModel({
        model: {
            selectedCard: '',
        },
    });

    const changeSelectedRadio = (selectedRadio: string) => {
        carauselModel.helpers.binders.setToModel('selectedCard', selectedRadio);
    };

    return  <div className={TopStyles['header-left']}>
        <div className={TopStyles.window}>
            <CarauselContent Content={carausel.CarauselOptions} SetSelectedRadio={changeSelectedRadio} SelectedRdoID={carauselModel.model.selectedCard} />
        </div>
        <CarauselDots Content={carausel.CarauselDotOptions} SelectedRdoID={carauselModel.model.selectedCard} />
    </div>;
}

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
        <CarauselHandler />
        <div className={TopStyles['header-right']}>
            <div className={TopStyles['greeting-header']}>
                <div className={TopStyles['owner-greeting']}>Hi! there, I'm</div>
                <div className={TopStyles['owner-name']}>{storage?.getConfigItem('PortfolioUserName')}</div>
                <UserPosition />
            </div>
            <div className={TopStyles['pathway']}>
                <div className={TopStyles['pathway-header']}>My work as a,</div>
                {navContentView}
            </div>
        </div>
    </div>;
}
//#endregion