import { useCallback, useReducer, useRef } from 'react';
import { usePortfolioSilentModel } from './usePortfolioModel';

type PortfolioCollectionProps<T extends Record<string, unknown>> = {
    collection: T[] | null;
    helperAttributes?: {
        name?: string;
        fetchFn?: () => Promise<T[]>;
        afterFetchTrig?: (collection: T[]) => void;
    };
};

type ResetActionType<T extends Record<string, unknown>> = {
    type: 'reset';
    attributes: T[];
};

type AddActionType<T extends Record<string, unknown>> = {
    type: 'add';
    attributes: T[];
};

type RemoveActionType<T extends Record<string, unknown>, S extends keyof T> = {
    type: 'remove';
    attributes: {
        identifierKey: S;
        identifierValue: T[S];
    };
};

type FindActionType<T extends Record<string, unknown>, S extends keyof T> = {
    type: 'find';
    attributes: {
        id: S,
        value: T[S],
    };
};

type ActionsType<T extends Record<string, unknown>> =
    | ResetActionType<T>
    | AddActionType<T>
    | RemoveActionType<T, keyof T>
    | FindActionType<T, keyof T>;

function collectionReducer<T extends Record<string, unknown>>(state: T[] | null, action: ActionsType<T>): T[] | null {
    switch(action.type) {
        case 'reset': return [...action.attributes];
        case 'add':
            return !state ? [...action.attributes] : [...state, ...action.attributes];
        case 'find':
            return !state ? null : state.filter(item => item[action.attributes.id] === action.attributes.value);
        case 'remove':
            return !state ? null : state.filter(item => item[action.attributes.identifierKey] !== action.attributes.identifierValue);
        default: return state;
    }
}

export default function usePortfolioCollection<T extends Record<string, unknown>>(props: PortfolioCollectionProps<T>){
    const [collection, collectionDispatcher] = useReducer<T[] | null, [ActionsType<T>]>(collectionReducer, props.collection);
    const silentModel = usePortfolioSilentModel({
        model: {
            IsInitialFetchHappened: false,
        }
    });

    const fetchFnRef = useRef(props.helperAttributes?.fetchFn);
    const afterFetchTrigRef = useRef(props.helperAttributes?.afterFetchTrig);
    const abortRef = useRef<AbortController | null>(null);
    const requestIdRef = useRef(0);
    const isCollectionLoading = useRef(false);
    const isCollectionEmpty = useRef<true | null>(null);

    const cancelFetching = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
    }, []);

    const fetchCollection = useCallback(async (includeToCollection?: boolean) => {
        const afterFetchFn = afterFetchTrigRef.current;
        try {
            const fetchFn = fetchFnRef.current;

            if(!fetchFn) return;

            isCollectionLoading.current = true;
            cancelFetching();
            const reqId = ++requestIdRef.current;

            const abortControllerHolder = new AbortController();
            abortRef.current = abortControllerHolder;
            const result = await fetchFn();
            if(abortControllerHolder.signal.aborted || reqId !== requestIdRef.current) return;

            if(includeToCollection) collectionDispatcher({ type: 'add', attributes: result });
            else collectionDispatcher({ type: 'reset', attributes: result });

            isCollectionLoading.current = false;
            if(!result.length) isCollectionEmpty.current = true;

            // let's mark that the initial fetch already happenned
            silentModel.binders.setToModel('IsInitialFetchHappened', true);
            if(afterFetchFn) afterFetchFn(result);
        } catch (E) {
            throw 'error found in fetching the collection ' + E;
        }
    }, [cancelFetching, silentModel.binders]);

    const doAnInitialFetch = useCallback((includeToCollection?: boolean) => {
        if(!silentModel.binders.getValue('IsInitialFetchHappened'))
            fetchCollection(includeToCollection);
    }, [fetchCollection, silentModel.binders]);

    const add = useCallback((collection: T[]) => {
        collectionDispatcher({ type: 'add', attributes: collection });
    }, []);

    const reset = useCallback((collection: T[]) => {
        collectionDispatcher({ type: 'reset', attributes: collection });
    }, []);

    return {
        collection,
        helpers: {
            nullOrEmptyViewHolderAttributes: {
                IsLoading: isCollectionLoading.current,
                IsResultEmpty: isCollectionEmpty.current,
                name: props.helperAttributes?.name
            },
            collectionAttributes: {
                IsInitialFetchHappened: silentModel.binders.getValue('IsInitialFetchHappened'),
            },
            fetchCollection,
            doAnInitialFetch,
            add,
            reset
        },
    };
}