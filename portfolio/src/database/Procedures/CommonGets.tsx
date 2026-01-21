/*
This function will be used to get the common small things from the DB
Created Date: 2026-1-21
*/

import { sort } from '../Functions/sort';
import { Tables } from '../Tables/tableExporter';

type CommonType = LatestPositionInputType;

type LatestPositionInputType = {
    Required: 'latestUserPosition';
};
type LatestPositionReturnType = {
    PositionID: number;
    Position: string;
};

type ReturnType = {
    latestUserPosition: LatestPositionReturnType;
};

export default async function CommonsGet<T extends CommonType>(props: T): Promise<ReturnType[T['Required']]> {

    switch(props.Required) {
        case 'latestUserPosition': return await LatestPositionGet();
    }
}

async function LatestPositionGet(): Promise<LatestPositionReturnType> {
    const OrganizationPositionTable = (await Tables.OrganizationPosition()).Pointer;
    const Position = (await Tables.utlJobPosition()).Pointer;

    const sortedOrgainzationPositions = sort(OrganizationPositionTable, 'StartedDate', 'desc');
    const filteredOrganizationPositions = sortedOrgainzationPositions.filter(sortedOrgainzationPosition => {
        return sortedOrgainzationPosition.EndedDate ? false : true;
    });

    return {
        PositionID: filteredOrganizationPositions[0].PositionID,
        Position: Position.filter(pos => pos.PositionID === filteredOrganizationPositions[0].PositionID)[0].Position,
    };
}