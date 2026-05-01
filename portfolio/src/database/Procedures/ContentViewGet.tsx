/*
This function will be used to get the relevant content view need to open
Created Date: 2026-1-16
*/

import { sort } from '../Functions/sort';
import { Tables } from '../Tables/tableExporter';

type NavContentViewType = {
    ContentViewID: number;
    ContentUtlViewID: number;
    ContentName: string;
};

export default async function ContentViewGet(SourceID: number, OutletID: number): Promise<NavContentViewType[]> {
    const returnResult: NavContentViewType[] = [];

    const contentViewTable = (await Tables.ContentView()).Pointer;
    const utlContentTable = (await Tables.utlContentView()).Pointer;

    const filteredContentView = contentViewTable.filter(content => content.OutletID === SourceID && content.NavID === OutletID && content.IsVisible);
    const sortedFilteredContents = sort(filteredContentView, 'SortOrder');
    sortedFilteredContents.map(content => {
        const contentName = utlContentTable.filter(contentName => contentName.ContentViewID === content.ContentUtlViewID)[0].ContentName;
        returnResult.push({
            ContentViewID: content.ContentViewID,
            ContentUtlViewID: content.ContentUtlViewID,
            ContentName: contentName,
        });
    });

    return returnResult;
}