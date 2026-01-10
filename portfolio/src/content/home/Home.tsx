import { useEffect } from 'react';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import { usePortfolioSilentModel } from '../../components/Hooks/usePortfolioModel';
import { useBaseStorage } from '../../components/utils/mainContext';
import { HomeAPI } from '../../controllers/HomeController';

import Footer from './Footer';
import Header from './Header';
import WorkExperience from '../workExperiance/workExperiance';
import UndergraduateLevel from '../undergraduate/Undergraduate';
import { OutletMapper } from '../../components/utils/constants';
import { useParams } from 'react-router-dom';

//#region type
type OutletCombinationsType = {
    ContentViewID: number;
    ContentUtlViewID: number;
    ContentName: string;
    OutletID: number;
    OutletName: string;
};
//#endregion

//#region collections

async function getOutlets(): Promise<OutletCombinationsType[]> {
    return HomeAPI.outletGet();
}

//#endregion

//#region Cmpnts
function Outlet(props: { SourceID?: string }){
    const storage = useBaseStorage();
    const silentModel = usePortfolioSilentModel({
        model: {
            Source: Number(props.SourceID) || 0,
        }
    });
    const { collection: outlet, helpers: outletHelper } = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            name: 'Outlets',
            fetchFn: getOutlets,
        }
    });

    useEffect(() => {
        if(!outlet) outletHelper.fetchCollection();
    }, [outletHelper, storage?.Model.SourceID, outlet]);

    let contentView = outletHelper.nullOrEmptyViewHolder;
    if(outlet && outlet.length) {
        contentView = outlet.map((navItem) => {
            switch(navItem.ContentUtlViewID) {
                case OutletMapper.School:
                    return <div></div>;
                case OutletMapper.Undergraduate:
                    return <UndergraduateLevel />;
                case OutletMapper.Work:
                    return <WorkExperience SourceID={silentModel.binders.getValue('Source')} ViewType='brief' />;
                default:
                    return <div></div>;
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