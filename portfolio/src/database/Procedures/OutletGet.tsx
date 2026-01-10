/*
This function will be used to get the relevant outlet details that are available in the table
Created Date: 2025-12-29
*/

import { sort } from '../Functions/sort';
import { Tables } from '../Tables/tableExporter';

export default async function OutletGet(): Promise<{
    ContentViewID: number;
    ContentUtlViewID: number;
    ContentName: string;
    OutletID: number;
    OutletName: string;
}[]> {
    const returnResult: {
        ContentViewID: number;
        ContentUtlViewID: number;
        ContentName: string;
        OutletID: number;
        OutletName: string;
    }[] = [];
    const outlet = (await Tables.utlOutlet()).Pointer.filter(outlet => outlet.OutletName === 'General')[0];
    const contentViews = (await Tables.ContentView()).Pointer.filter(content => content.OutletID === outlet.OutletID && content.IsVisible);
    const utlContentViews = (await Tables.utlContentView()).Pointer;
    const sortedContents = sort(contentViews, 'DateInserted');

    // including outlet ID and name to sorted content
    sortedContents.map((content, index) => {
        if(index <= 2) {
            returnResult.push({
                ContentViewID: content.ContentViewID,
                ContentUtlViewID: content.ContentUtlViewID,
                ContentName: utlContentViews.filter(utlContent => utlContent.ContentViewID === content.ContentUtlViewID)[0].ContentName,
                OutletID: outlet.OutletID,
                OutletName: outlet.OutletName,
            });
        }
    });

    return returnResult;
}