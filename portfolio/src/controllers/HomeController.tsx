import ContentViewGet from '../database/Procedures/ContentViewGet';
import NavHeadersGet from '../database/Procedures/NavHeadersGet';
import OutletGet from '../database/Procedures/OutletGet';

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

export const HomeAPI = {
    outletGet,
    navHeadersGet,
    contentViewGet,
};