import { useEffect, useReducer, useRef, useState } from 'react';
import Loader from '../Loader/Loader';

import PortFolioStyles from './HookStyles/portfolioStyles.module.css';

type PortfolioCollectionProps<T extends Record<string, unknown>> = {
    collection: T[] | null;
    helperAttributes?: {
        name?: string;
        fetchFn?: () => Promise<T[]>;
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
    const fetchCollection = useRef<{
        fetch: boolean;
        includeToCollection?: boolean;
    } | null>({ fetch: false });

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
                const collection = await props.helperAttributes.fetchFn();
                if(fetchAttributes) {
                    if(fetchAttributes.add){
                        collectionDispatcher({
                            type: 'add',
                            attributes: collection,
                        });
                    }
                }
                collectionDispatcher({
                    type: 'reset',
                    attributes: collection,
                });
            }
            fetchCollection.current = ({
                fetch: false,
            });
        };

        if(fetchCollection && fetchCollection.current && fetchCollection.current.fetch) {
            if(fetchCollection.current.includeToCollection) {
                startFetchingCollection({ add: true });
            } else startFetchingCollection();
        }
    }, [fetchCollection, props.helperAttributes]);

    return {
        collection,
        collectionDispatcher,
        helpers: {
            nullOrEmptyViewHolder: [stateElements],
            fetchCollection,
        },
    };
}