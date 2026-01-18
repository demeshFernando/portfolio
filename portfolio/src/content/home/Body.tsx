import { usePortfolioModel, usePortfolioSilentModel } from '../../components/Hooks/usePortfolioModel';
import { OutletMapper } from '../../components/utils/constants';
import { useBaseStorage } from '../../components/utils/mainContext';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import { useEffect } from 'react';

import UndergraduateLevel from '../undergraduate/Undergraduate';
import WorkExperience from '../workExperiance/workExperiance';
import MainHeader from '../../components/mainHeader/MainHeader';

import { HomeAPI } from '../../controllers/HomeController';
import { common } from '../../components/utils/common';

// #region Types & Collections
type OutletsType = {
    ContentViewID: number;
    ContentName: string;
};

async function fetchNavs(SourceId: number) {
    return await HomeAPI.navHeadersGet(SourceId);
}

async function fetchOutlets(outletId: number, sourceId: number): Promise<OutletsType[]> {
    return HomeAPI.contentViewGet(outletId, sourceId);
}
// #endregion

// #region Cmpnts
function Outlet(props: { selectedNavID: number }){
    const storage = useBaseStorage();
    const silentModel = usePortfolioSilentModel({
        model: {
            Source: Number(storage?.Pop('SourceID')) || 1,
            SelectedNavID: 0,
        }
    });
    const outletCollection = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            fetchFn: () => fetchOutlets(silentModel.binders.getValue('Source'), silentModel.binders.getValue('SelectedNavID')),
            name: 'Outlets'
        }
    });

    useEffect(() => {
        if(!outletCollection.collection) outletCollection.helpers.fetchCollection();
    }, [outletCollection.collection, outletCollection.helpers]);
    useEffect(() => {
        if(silentModel.binders.getValue('SelectedNavID') == 0 || silentModel.silentModelHelper.hasSilentModelChanged('SelectedNavID')) {
            silentModel.binders.setToModel('SelectedNavID', props.selectedNavID);
            silentModel.silentModelHelper.neutrilizeSilentModel('SelectedNavID');
            outletCollection.helpers.fetchCollection();
        }
    }, [outletCollection.helpers, props.selectedNavID, silentModel.binders, silentModel.silentModelHelper]);

    let contentView = common.nullOrEmptyViewHolder(outletCollection.helpers.nullOrEmptyViewHolderAttributes);

    if(outletCollection.collection && outletCollection.collection.length) {
        contentView = outletCollection.collection.map((navItem) => {
            switch(navItem.ContentViewID) {
                case OutletMapper.School:
                    return <div key={navItem.ContentViewID}></div>;
                case OutletMapper.Undergraduate:
                    return <UndergraduateLevel key={navItem.ContentViewID} />;
                case OutletMapper.Work:
                    return <WorkExperience key={navItem.ContentViewID}  SourceID={silentModel.binders.getValue('Source')} ViewType='brief' />;
                default:
                    return <div key={navItem.ContentViewID}></div>;
            }
        });
    }

    return contentView;
}

export default function Body() {
    const storage = useBaseStorage();

    const bodyModel = usePortfolioModel({
        model: {
            ActiveNavID: 0,
        },
    });
    const navCollection = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            fetchFn: () => fetchNavs(Number(storage?.Pop('SourceID')) || 0),
            name: 'Outlets'
        },
    });

    const changeActiveNavElementID = (elementID: number) => bodyModel.helpers.binders.setToModel('ActiveNavID', elementID);

    useEffect(() => {
        if(!navCollection.collection) navCollection.helpers.fetchCollection();
    }, [navCollection.collection, navCollection.helpers]);
    useEffect(() => {
        if(navCollection.collection && navCollection.collection.length && (bodyModel.helpers.hasModelChanged('ActiveNavID') || bodyModel.model.ActiveNavID === 0)) {
            bodyModel.helpers.binders.setToModel('ActiveNavID', navCollection.collection[0].NavID);
            bodyModel.helpers.neutrlizeModel('ActiveNavID');
        }
    }, [bodyModel.helpers, bodyModel.helpers.binders, bodyModel.model.ActiveNavID, navCollection.collection]);
    return <>
        <MainHeader
            ActiveNavID={bodyModel.model.ActiveNavID}
            IsElementEnabled={true}
            onActiveElementChange={changeActiveNavElementID}
            NavItems={navCollection.collection}
        />
        <Outlet selectedNavID={bodyModel.model.ActiveNavID} />
    </>;
}
// #endregion