import { useEffect } from 'react';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import { HomeAPI } from '../../controllers/HomeController';
import { useParams } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import Body from './Body';
import { useBaseStorage } from '../../components/utils/mainContext';
import { common } from '../../components/utils/common';

//#region type
export type OutletCombinationsType = {
    OutletID: number;
    Outlet: string;
};
//#endregion

//#region collections

async function getOutlets() {
    return HomeAPI.outletGet();
}

//#endregion

//#region Cmpnts
export default function Home() {
    //fetch the param
    const { sourceId } = useParams<{sourceId?: string}>();
    const storage = useBaseStorage();

    const outletCollection = usePortfolioCollection({ collection: null, helperAttributes: { fetchFn: getOutlets, name: 'Outlets' } });
    useEffect(() => {
        outletCollection.helpers.doAnInitialFetch();
        if(sourceId) storage?.Push('SourceID', Number(sourceId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let contentView = common.nullOrEmptyViewHolder(outletCollection.helpers.nullOrEmptyViewHolderAttributes);
    if(outletCollection.collection && outletCollection.collection.length) {
        contentView = [<>
            <Header OutletData={outletCollection.collection} />
            <Body />
            <Footer />
        </>];
    }

    return contentView;
}
//#endregion