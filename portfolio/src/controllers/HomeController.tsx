import OutletGet from '../database/Procedures/OutletGet';

async function outletGet(): Promise<{
    ContentViewID: number;
    ContentUtlViewID: number;
    ContentName: string;
    OutletID: number;
    OutletName: string;
}[]> {
    try {
        const result = await OutletGet();
        if(result) {
            return result;
        } else return [];
    } catch {
        throw new Error('Out let data cannot be fetched');
    }
}

export const HomeAPI = {
    outletGet: outletGet,
};