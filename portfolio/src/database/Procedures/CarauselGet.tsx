/*
This function will be used to get the Carausel card details
Created Date: 2026-2-7
*/

import { sort } from '../Functions/sort';
import { Tables } from '../Tables/tableExporter';

type CarauselGetReturnType = {
    ID: number;
    Img: string;
    Header: string;
    SubHeader: string;
    Body: string;
};

export default async function CarauselGet(StylesAddedList: number[]): Promise<CarauselGetReturnType[]> {
    const returnResult: CarauselGetReturnType[] = [];

    const CarauselTable = (await Tables.Carausel()).Pointer;

    // the carausel table can only have the IDs which has provided styles in the front end
    // So,
    const filteredCarauselTable = CarauselTable.filter(carauselCard => {
        const isIdAvailable = StylesAddedList.filter(ID => ID === carauselCard.CarauselID);
        return isIdAvailable.length > 0;
    });

    // now we have to sort the carausel list
    const sortedCarauselList = sort(filteredCarauselTable, 'CarauselID');

    // first push the begining half, middle and end
    sortedCarauselList.map(carausel => {
        returnResult.push({
            ID: carausel.CarauselID,
            Img: carausel.ImgBlob,
            Header: carausel.Header,
            SubHeader: carausel.SubHeader,
            Body: carausel.Body
        });
    });

    return returnResult;
}