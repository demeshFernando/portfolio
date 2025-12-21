import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import Loader from '../Loader/Loader';

import PortFolioStyles from './HookStyles/portfolioStyles.module.css';

type PortfolioCollectionProps<T extends Record<string, unknown>> = {
    collection: T[] | null;
    helperAttributes?: {
        name?: string;
        fetchFn?: () => Promise<T[]>;
        afterFetchTrig?: () => void;
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
    const [stateElements, setStateElements] = useState(<Loader key={0} />);
    const [shouldCollectionFetch, setCollectionFetcher] = useState<{
        fetch: boolean;
        includeToCollection?: boolean;
    }>({ fetch: false });
    const fetchCollectionRef = useRef<{
        fetch: boolean;
        fetchCount: number;
    }>({
        fetch: false,
        fetchCount: 0
    });

    const fetchCollection = useCallback((timesToBeFetched?: number, includeToCollection?: boolean) => {
        if(includeToCollection) setCollectionFetcher({ fetch: true, includeToCollection: true });
        setCollectionFetcher({ fetch: true });

        if(timesToBeFetched && timesToBeFetched <= fetchCollectionRef.current['fetchCount']) {
            const prevFetchRef = fetchCollectionRef.current;
            fetchCollectionRef.current = {
                fetch: true,
                fetchCount: prevFetchRef.fetchCount++
            };
        } else if(!fetchCollectionRef.current['fetchCount']) {
            fetchCollectionRef.current = {
                fetch: true,
                fetchCount: 1
            };
        }
    }, []);

    useEffect(() => {
        if(collection && !collection.length) {
            setStateElements(<p key={0} className={PortFolioStyles['empty-collection-style']}>No {props.helperAttributes && props.helperAttributes.name ? props.helperAttributes.name : 'Collections'} Found</p>);
        }
    }, [collection, props.helperAttributes]);

    useEffect(() => {
        // let's fetch the collection if available
        const startFetchingCollection = async (fetchAttributes?: {
            add?: boolean;
        }) => {
            if(props.helperAttributes && props.helperAttributes.fetchFn) {
                try {
                    const collection = await props.helperAttributes.fetchFn();
                    if(fetchAttributes && collection) {
                        if(fetchAttributes.add){
                            collectionDispatcher({
                                type: 'add',
                                attributes: collection,
                            });
                        }
                    }
                    if(collection) {
                        collectionDispatcher({
                            type: 'reset',
                            attributes: collection,
                        });
                    }
                } catch (E) {
                    throw 'error found in fetching the collection ' + E;
                } finally {
                    if(props.helperAttributes.afterFetchTrig) props.helperAttributes.afterFetchTrig();
                }
            }
            fetchCollectionRef.current['fetch'] = false;
            setCollectionFetcher({ fetch: false, includeToCollection: false });
        };

        if(fetchCollectionRef && fetchCollectionRef.current && shouldCollectionFetch.fetch) {
            if(shouldCollectionFetch.includeToCollection) {
                startFetchingCollection({ add: true });
            } else startFetchingCollection();
        }
    }, [shouldCollectionFetch.fetch, props.helperAttributes, shouldCollectionFetch.includeToCollection]);

    return {
        collection,
        collectionDispatcher,
        helpers: {
            nullOrEmptyViewHolder: [stateElements],
            fetchCollection,
        },
    };
}