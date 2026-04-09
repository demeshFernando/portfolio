import { useBaseStorage } from '../../components/utils/mainContext';
import { usePortfolioModel } from '../../components/Hooks/usePortfolioModel';
import TopStyles from './header.module.css';
import type { OutletCombinationsType } from './Home';
import { useEffect, useState } from 'react';
import { HomeAPI } from '../../controllers/HomeController';

import NavBar from '../../components/NavBar/NavBar';
import { Carausel, CarauselContent, CarauselDots } from '../../components/Caraousel/Caraousel';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import { common } from '../../components/utils/common';

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
async function carauselGet(idList: number[]) {
    return await HomeAPI.carauselGet(idList);
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

function CarauselHandler() {
    let carausel = new Carausel(null);
    const carauselModel = usePortfolioModel({
        model: {
            selectedCard: '',
        },
    });
    const carauselCollection = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            name: 'Carausel',
            fetchFn: () => carauselGet(carausel.styleIDs),
        }
    });

    const changeSelectedRadio = (selectedRadio: string) => {
        carauselModel.helpers.binders.setToModel('selectedCard', selectedRadio);
    };

    useEffect(() => {
        carauselCollection.helpers.doAnInitialFetch();
    }, [carauselCollection.collection, carauselCollection.helpers]);

    if(carauselCollection.collection && carauselCollection.collection.length) {
        carausel = new Carausel(carauselCollection.collection);
        return  <div className={TopStyles['header-left']}>
            <div className={TopStyles.window}>
                <CarauselContent Content={carausel.CarauselOptions} SetSelectedRadio={changeSelectedRadio} SelectedRdoID={carauselModel.model.selectedCard} />
            </div>
            <CarauselDots Content={carausel.CarauselDotOptions} SelectedRdoID={carauselModel.model.selectedCard} />
        </div>;
    }
    return <div className={TopStyles['header-left']}>
        <div className={TopStyles.window}>
            {common.nullOrEmptyViewHolder(carauselCollection.helpers.nullOrEmptyViewHolderAttributes)}
        </div>
     </div>;
}

export default function Header(props: { OutletData: OutletCombinationsType[] }) {
  const { model: headerModel, helpers: headerHelpers } = usePortfolioModel<NavHeaderType>({ model: { LoadNavBar: false, Vision: '' } });
  const storage = useBaseStorage();

  const onMainNavItemClick = (sourceId: number) => {
        headerHelpers.binders.setToModel('LoadNavBar', true);
        storage?.pushes({
            SourceID: sourceId,
            MajorSourceIdsLoaded: {
                isNavsLoaded: false,
                isFocusedContentLoaded: false,
                isBottomContentLoaded: false,
            },
        });
    };

    useEffect(() => {
        const isLoaded = storage?.Pop('DisableSourceLoader');
        if (isLoaded) headerHelpers.binders.setToModel('LoadNavBar', false);
    }, [headerHelpers.binders, storage, storage?.Model.DisableSourceLoader]);

  const navContentView = [<NavBar key={'main-header-nav'} DisableNavBar={headerModel.LoadNavBar} Items={props.OutletData} onClick={onMainNavItemClick} />];

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