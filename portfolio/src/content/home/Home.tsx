import { useEffect } from 'react';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import { usePortfolioSilentModel } from '../../components/Hooks/usePortfolioModel';
import { useBaseStorage } from '../../components/utils/mainContext';

import Footer from './Footer';
import Header from './Header';
import WorkExperience from '../workExperiance/workExperiance';
import UndergraduateLevel from '../undergraduate/Undergraduate';
import { OutletMapper } from '../../components/utils/constants';
import { useParams } from 'react-router-dom';
import { isNumber } from '../../components/utils/common';

//#region type
type OutletCombinationsType = {
    NavHeaderID: number;
    Name: string;
};
//#endregion

//#region collections
const outletCombination1: OutletCombinationsType[] = [
    {
        NavHeaderID: 1,
        Name: 'Software Engineer'
    },
    {
        NavHeaderID: 2,
        Name: 'Undergraduate'
    }
];
const outletCombination2: OutletCombinationsType[] = [
    {
        NavHeaderID: 3,
        Name: 'Work',
    },
    {
        NavHeaderID: 2,
        Name: 'Undergraduate'
    }
];

async function getOutlets(sourceId: number): Promise<OutletCombinationsType[]> {
    if(sourceId === 1) {
        return outletCombination1;
    }
    return outletCombination2;
}

//#endregion

//#region Cmpnts
function Outlet(props: { SourceID?: string }){
    const storage = useBaseStorage();
    const silentModel = usePortfolioSilentModel({
        model: {
            Source: 0
        }
    });
    const { collection: outlet, helpers: outletHelper } = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            name: 'Outlets',
            fetchFn: () => {
                if(props.SourceID && isNumber(props.SourceID)){
                    silentModel.binders.setToModel('Source', Number(props.SourceID));
                    return getOutlets(Number(props.SourceID));
                }
                else if(storage && storage.Pop('SourceID')) {
                    silentModel.binders.setToModel('Source', storage.Pop('SourceID'));
                    return getOutlets(storage.Pop('SourceID'));
                }
                throw 'SourceID need to be fixed to fetch the outlets';
            },
        }
    });

    useEffect(() => {
        if(!outlet) outletHelper.fetchCollection();
    }, [outletHelper, storage?.Model.SourceID, outlet]);

    let contentView = outletHelper.nullOrEmptyViewHolder;
    if(outlet && outlet.length) {
        contentView = outlet.map((navItem) => {
            switch(navItem.NavHeaderID) {
                case OutletMapper.Undergraduate:
                    return <UndergraduateLevel />;
                case OutletMapper.SoftwareEngineer:
                    return <WorkExperience SourceID={silentModel.binders.getValue('Source')} ViewType='brief' />;
                default:
                    return <WorkExperience SourceID={silentModel.binders.getValue('Source')} ViewType='brief' />;
            }
        });
    }

    return contentView;
}

export default function Home() {
    //fetch the param
    const { sourceId } = useParams<{sourceId?: string}>();
    return <>
        <Header />
        <Outlet SourceID={sourceId} />
        <Footer />
    </>;
}
//#endregion