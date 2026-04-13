/*
This function will be used to get the relevant Nav details that are available in the table
Created Date: 2025-12-29
*/

import { sort } from '../Functions/sort';
import { Tables } from '../Tables/tableExporter';

type NavHeaderType = {
    NavID: number;
    Name: string;
    SortOrder: number;
};

export default async function NavHeadersGet(outletID: number): Promise<NavHeaderType[]> {
    const returnResult: NavHeaderType[] = [];
    const outlet = (await Tables.utlOutlet()).Pointer.filter(outlet => outlet.OutletID === outletID)[0];
    const outletNavContent = (await Tables.OutletNavContent()).Pointer.filter(navContent => navContent.OutletID === outlet.OutletID);
    // active outlet navs
    const utlNavContent = (await Tables.utlNavContent()).Pointer.filter(nav => nav.IsActive);

    outletNavContent.map(outletNav => {
        utlNavContent.map(nav => {
            if(outletNav.NavID === nav.NavContentID) {
                returnResult.push({
                    NavID: nav.NavContentID,
                    Name: nav.Name,
                    SortOrder: outletNav.SortOrder
                });
            }
        });
    });

    return sort(returnResult, 'SortOrder');
}