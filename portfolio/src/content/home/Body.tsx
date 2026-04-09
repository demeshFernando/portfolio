import { usePortfolioModelWithSilent, usePortfolioSilentModel } from '../../components/Hooks/usePortfolioModel';
import { OutletMapper } from '../../components/utils/constants';
import { useBaseStorage } from '../../components/utils/mainContext';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import { useCallback, useEffect } from 'react';

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
            name: 'Outlets',
            afterFetchTrig: () => {
                // since new collection is being fetched we can make storage false
                const storageLoadedState = storage?.Pop('MajorSourceIdsLoaded');
                if(storageLoadedState) {
                    storageLoadedState.isFocusedContentLoaded = true;
                    storageLoadedState.isBottomContentLoaded = true;
                    storage?.Push('MajorSourceIdsLoaded', storageLoadedState);

                    if(!storage?.Pop('DisableSourceLoader') && storageLoadedState.isNavsLoaded) {
                        storage?.Push('DisableSourceLoader', true);
                    }
                }
            },
        }
    });

    useEffect(() => {
        outletCollection.helpers.doAnInitialFetch();
    }, [outletCollection.collection, outletCollection.helpers]);
    useEffect(() => {
        if(silentModel.binders.getValue('SelectedNavID') == 0 || silentModel.binders.getValue('SelectedNavID') !== props.selectedNavID) {
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

    const { model: bodyModel, silentModel: bodySilentModel } = usePortfolioModelWithSilent({
        model: {
            ActiveNavID: 0,
            RefreshKey: 0,
        },
        silentModel: {
            SourceID: 0,
        },
    });
    const navCollection = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            fetchFn: () => fetchNavs(bodySilentModel.binders.getValue('SourceID')),
            name: 'Outlets'
        },
    });

    const changeActiveNavElementID = (elementID: number) => bodyModel.helpers.binders.setToModel('ActiveNavID', elementID);
    const fetchNavItems = useCallback(() => {
        // we have to check whether the sourceID was changed
        if(storage?.HasContextItemChanged('SourceID')) {
            bodySilentModel.binders.setToModel('SourceID', storage?.Pop('SourceID'));
            bodyModel.helpers.binders.setToModel('RefreshKey', bodyModel.model.RefreshKey++);
            navCollection.helpers.fetchCollection();
            storage?.neurtrilizeContext('SourceID');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bodySilentModel.binders, navCollection.helpers, storage]);

    useEffect(() => {
        if(!navCollection.collection) fetchNavItems();
    }, [fetchNavItems, navCollection.collection, navCollection.helpers]);
    useEffect(() => {
        if(navCollection.collection && navCollection.collection.length && (bodyModel.helpers.hasModelChanged('ActiveNavID') || bodyModel.model.ActiveNavID === 0)) {
            // the active nav ID should be changed only when it is 0
            if(bodyModel.model.ActiveNavID === 0) {
                bodyModel.helpers.binders.setToModel('ActiveNavID', navCollection.collection[0].NavID);
            }

            bodyModel.helpers.neutrlizeModel('ActiveNavID');
        }
    }, [bodyModel.helpers, bodyModel.helpers.binders, bodyModel.model.ActiveNavID, navCollection.collection]);

    // this useeffect will take care when the source ID got changed
    useEffect(() => {
        fetchNavItems();
    }, [fetchNavItems, storage?.Model.SourceID]);

    return <>
        <MainHeader
            RefreshKey={bodyModel.model.RefreshKey}
            ActiveNavID={bodyModel.model.ActiveNavID}
            IsElementEnabled={true}
            onActiveElementChange={changeActiveNavElementID}
            NavItems={navCollection.collection}
        />
        <Outlet selectedNavID={bodyModel.model.ActiveNavID} />
    </>;
}
// #endregion