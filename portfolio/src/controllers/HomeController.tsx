import CarauselGet from '../database/Procedures/CarauselGet';
import CommonsGet from '../database/Procedures/CommonGets';
import ContentViewGet from '../database/Procedures/ContentViewGet';
import NavHeadersGet from '../database/Procedures/NavHeadersGet';
import OutletGet from '../database/Procedures/OutletGet';
import PrimaryContactsGet from '../database/Procedures/PrimaryContactDetailsGet';

async function outletGet() {
    try {
        const result = await OutletGet();
        if(result) {
            return result;
        } else return [];
    } catch {
        throw new Error('Out let data cannot be fetched');
    }
}

async function navHeadersGet(outletID: number) {
    try {
        const result = await NavHeadersGet(outletID);
        if(result) return result;
        else return [];
    } catch {
        throw new Error('Nav data fetching failed');
    }
}

async function contentViewGet(outletID: number, sourceID: number) {
    try {
        const result = await ContentViewGet(outletID, sourceID);
        if(result) return result;
        else return [];
    } catch {
        throw new Error('Content view fetching failed');
    }
}

async function primaryContactGet() {
    try {
        const result = await PrimaryContactsGet();
        return result;
    } catch {
        throw new Error('Primary Contacts cannot be fetched');
    }
}

async function latestUserPositionGet() {
    try {
        const result = await CommonsGet({ Required: 'latestUserPosition' });
        return result;
    } catch {
        throw new Error('Failed to fetch latest user position');
    }
}

async function carauselGet(idList: number[]) {
    try {
        const result = await CarauselGet(idList);
        return result;
    } catch {
        throw new Error('Carausel Fetching failed');
    }
}

export const HomeAPI = {
    outletGet,
    navHeadersGet,
    contentViewGet,
    primaryContactGet,
    latestUserPositionGet,
    carauselGet
};