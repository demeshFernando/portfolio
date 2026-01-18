/*
This function will be used to get the relevant content view need to open
Created Date: 2026-1-16
*/

import { sort } from '../Functions/sort';
import { Tables } from '../Tables/tableExporter';

type NavContentViewType = {
    ContentViewID: number;
    ContentName: string;
};

export default async function ContentViewGet(SourceID: number, OutletID: number): Promise<NavContentViewType[]> {
    const returnResult: NavContentViewType[] = [];

    const contentViewTable = (await Tables.ContentView()).Pointer;
    const utlContentTable = (await Tables.utlContentView()).Pointer;

    const filteredContentView = contentViewTable.filter(content => content.OutletID === SourceID && content.NavID === OutletID && content.IsVisible);
    const sortedFilteredContents = sort(filteredContentView, 'DateInserted');
    sortedFilteredContents.map(content => {
        const contentName = utlContentTable.filter(contentName => contentName.ContentViewID === content.ContentViewID)[0].ContentName;
        returnResult.push({
            ContentViewID: content.ContentViewID,
            ContentName: contentName,
        });
    });

    return returnResult;
}