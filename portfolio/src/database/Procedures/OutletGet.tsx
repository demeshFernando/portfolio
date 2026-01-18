/*
This function will be used to get the relevant outlet details that are available in the table
Created Date: 2025-12-29
*/

import { sort } from '../Functions/sort';
import { Tables } from '../Tables/tableExporter';

type OutletType = {
    OutletID: number;
    Outlet: string;
};

export default async function OutletGet(requiredSourceID?: number): Promise<OutletType[]> {
    const returnResult: OutletType[] = [];
    let isCustomOutletSelecting = true;

    const utlOutletOutletCategoriesTable = (await Tables.utlOutletUtlOutletCategories()).Pointer;
    const utlOutletTable = (await Tables.utlOutlet()).Pointer;

    // let's fetch the outlets
    if(requiredSourceID) {
        // if category is present
        // we have fetch them accordingly
        const categoryOutlet = utlOutletTable.filter(a => a.OutletID === requiredSourceID)[0];
        isCustomOutletSelecting = false;

        //if there are any outlet found
        if(categoryOutlet) {
            // let's fetch available categories
            const categories = utlOutletOutletCategoriesTable.filter(category => categoryOutlet.OutletID === category.OutletID && category.IsActive);
            // we have to sanitize the outlets
            const allFilteredOutlets: {
                OutletOutletCategoryID: number;
                CategoryID: number;
                OutletID: number;
                OutletName: string;
                Priority: number;
            }[] = [];

            categories.map(category => {
                const consideringOutletName = utlOutletTable.filter(outlet => category.OutletID === outlet.OutletID)[0].OutletName;
                if(!isOutletAlreadyAdded(allFilteredOutlets, 'OutletName', consideringOutletName)) {
                    allFilteredOutlets.push({
                        OutletOutletCategoryID: category.OutletOutletCategoriesID,
                        CategoryID: category.OutletCategoriesID,
                        OutletID: category.OutletID,
                        OutletName: consideringOutletName,
                        Priority: category.Priority,
                    });
                }
            });

            // if there are any filtered outlets we have to return only three of them
            if(allFilteredOutlets.length) {
                if(allFilteredOutlets.length <= 3) {
                    allFilteredOutlets.map(outlet => returnResult.push({ OutletID: outlet.OutletID, Outlet: outlet.OutletName }));
                } else {
                    // now since we have the required outlet type we have to make sure it appears first in the order
                    returnResult.push({
                        OutletID: categoryOutlet.OutletID,
                        Outlet: categoryOutlet.OutletName
                    });

                    // rest two will be selected according to the priority
                    const prioritizedOutlets = sort(allFilteredOutlets, 'Priority');
                    prioritizedOutlets.map((outlet, index) => {
                        if(outlet.OutletID !== returnResult[0].OutletID && index < 2) {
                            returnResult.push({
                                OutletID: outlet.OutletID,
                                Outlet: outlet.OutletName
                            });
                        }
                    });
                }
            } else isCustomOutletSelecting = true; // since required source don't have any return the custom created ones
        }
    }

    if(isCustomOutletSelecting) {
        // in here we have to select custom outlets available
        // first let's get the high priority category outlets
        const prioritizedOutlets = sort(utlOutletOutletCategoriesTable, 'Priority');

        prioritizedOutlets.map((outletCategory, index) => {
            // first we have to make sure the inserting outlet is not already added
            if(!isOutletAlreadyAdded(returnResult, 'OutletID', outletCategory.OutletID) && index <= 2) {
                returnResult.push({
                    OutletID: outletCategory.OutletID,
                    Outlet: utlOutletTable.filter(outlet => outletCategory.OutletID === outlet.OutletID)[0].OutletName
                });
            }
        });
    }

    return returnResult;
}

function isOutletAlreadyAdded<T extends Record<string, unknown>, S extends keyof T>(array: T[], key: S, value: T[S]):boolean {
    return array.filter(a => a[key] === value).length > 0;
}