import type { JSX } from 'react';
import Loader from '../Loader/Loader';
import { format, intervalToDuration, isAfter } from 'date-fns';
import { configs } from './application.config';

type MultiPropsType<T extends Record<string, unknown>, S extends keyof T> = {
    identifier: 'multi',
    model: T,
    binders: {
        [K in S]?: T[K];
    }
};

type KeyValuePropsType<T extends Record<string, unknown>, S extends keyof T> = {
    identifier: 'single',
    model: T,
    key: S,
    value: T[S],
};

type ModelProps<T extends Record<string, unknown>, S extends keyof T> = MultiPropsType<T, S> | KeyValuePropsType<T, S>;

function bindToModel<T extends Record<string, unknown>, S extends keyof T>(props: ModelProps<T, S>): T {
    //if we got multi binder
    if (props.identifier === 'single') {
        return {
            ...props.model,
            [props.key]: props.value,
        };
    }
    return {
        ...props.model,
        ...props.binders,
    };
}

async function executeCollectionFetcher<T extends Record<string, unknown>>(fetchFn: () => Promise<T[]>): Promise<T[]> {
    try {
        //let's try executing the function
        const results = await fetchFn();
        return results;
    } catch (E) {
        throw 'Cannot fetch ' + E;
    }
}

function formatDateOnly(value: Date): string {
    return format(value, configs.DateFormat);
}

function pronounceDate(startDate: Date, endDate: Date = new Date(), sensitivityLevel: 'year' | 'month' | 'day' = 'year'): string {
    const interval = intervalToDuration({
        start: startDate,
        end: endDate,
    });

    // ====== NOTE: This will not produce the date the with exact accuracy ======
    // how this works
    // first if the sensitivity is in year level
    // ... if there are more than 1 year then it will display the number of years like 'X years'
    // ... if there are less than 1 year then it will just shows the months 'x months'
    // ... if month < 1 then just returned an empty string
    // if sensitivity is in month level
    // ... if years > 1 then 'X years and y months'
    // ... if years < 1 then 'y months'
    // ... if months < 1 then an empty string
    // if sensitivity is in day level
    // ... if years > 1 then 'X years, y months and z days'
    // ... if years < 1 then 'y months and z days'
    // ... if years = null, month < 1 then 'z days'
    // ... if this is less than a day then an empty string will be returned

    // if startDate > endDate it should return nothing
    if (!isAfter(endDate, startDate)) return '';

    if (sensitivityLevel === 'year' || sensitivityLevel === 'month') {
        if (interval.years) {
            if (interval.years > 1) return `${interval.years} Years`;
            else if (interval.years <= 1 && interval.months && interval.months > 1) return `${interval.months} Months`;
            else if (interval.years <= 1 && interval.months) return `${interval.months} Month`;
        } else if (interval.months) {
            if (interval.months > 1) return `1 Year And ${interval.months} Months`;
            else return '1 Year And 1 Month';
        }
    } else if (sensitivityLevel === 'day') {
        if (interval.years && interval.months && interval.days) {
            if (interval.years > 1) {
                if (interval.months > 1) {
                    const base = `${interval.years} Years, ${interval.months}`;
                    if (interval.days > 1) return `${base} And ${interval.days} Days`;
                    else return `${base} And 1 Day`;
                } else {
                    const base = `${interval.years} Years, 1 Month`;
                    if (interval.days > 1) return `${base} And ${interval.days} Days`;
                    else return `${base} And 1 Day`;
                }
            } else {
                if (interval.months > 1) {
                    const base = `1 Year, ${interval.months}`;
                    if (interval.days > 1) return `${base} And ${interval.days} Days`;
                    else return `${base} And 1 Day`;
                } else {
                    const base = '1 Year, 1 Month';
                    if (interval.days > 1) return `${base} And ${interval.days} Days`;
                    else return `${base} And 1 Day`;
                }
            }
        } else if (interval.years && interval.months) {
            if (interval.years > 1) {
                if (interval.months > 1) return `${interval.years} Years And ${interval.months}`;
                else return `${interval.years} Years And 1 Month`;
            } else {
                if (interval.months > 1) return `1 Year And ${interval.months}`;
                else return '1 Year And 1 Month';
            }
        } else if (interval.years && interval.days) {
            if (interval.years > 1) {
                const base = `${interval.years} Years`;
                if (interval.days > 1) return `${base} And ${interval.days} Days`;
                else return `${base} And 1 Day`;
            } else {
                const base = '1 Year';
                if (interval.days > 1) return `${base} And ${interval.days} Days`;
                else return `${base} And 1 Day`;
            }
        } else if (interval.years && interval.years >= 1) return `${interval.years} Years`;
    }
    return '';
}

function isNumber(value: unknown): value is number {
    try {
        return !!Number(value);
    } catch {
        return false;
    }
}

function nullOrEmptyViewHolder(state: {
    IsLoading: boolean;
    IsResultEmpty: true | null;
    name?: string;
}, overrideMessage?: string): JSX.Element[] {
    //if the state is in loading
    if (state.IsLoading) return [<Loader key={0} />];
    if (!state.IsLoading && state.IsResultEmpty) {
        if (overrideMessage) {
            return [
                <p key={0} className='empty-collection-style'>{overrideMessage}</p>
            ];
        } else if (state.name) {
            return [
                <p key={0} className='empty-collection-style'>No {state.name} Found</p>
            ];
        }
    }
    return [
        <p key={0} className='empty-collection-style'>No Collections Found</p>
    ];
}

export const common = {
    bindToModel,
    executeCollectionFetcher,
    isNumber,
    nullOrEmptyViewHolder,
    // date exports
    formatDateOnly,
    pronounceDate
};