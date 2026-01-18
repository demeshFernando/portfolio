import type { JSX } from 'react';
import Loader from '../Loader/Loader';

type MultiPropsType<T extends Record<string ,unknown>, S extends keyof T> = {
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

function bindToModel<T extends Record<string, unknown>, S extends keyof T>(props: ModelProps<T, S>): T{
    //if we got multi binder
    if(props.identifier === 'single') {
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
    if(state.IsLoading) return [<Loader key={0} />];
    if(!state.IsLoading && state.IsResultEmpty) {
        if(overrideMessage) {
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
    nullOrEmptyViewHolder
};