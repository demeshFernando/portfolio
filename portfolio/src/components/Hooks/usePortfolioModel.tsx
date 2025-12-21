import { useReducer } from 'react';

import { bindToModel } from '../utils/common';

type ModelType<T extends Record<string, unknown>> = {
    model: T,
};

type SingleAcitionType<T extends Record<string, unknown>, S extends keyof T> = {
    type: 'set',
    key: S,
    value: T[S],
};

type MultiActionsType<T extends Record<string, unknown>, S extends keyof T> = {
    type: 'sets',
    attributes: {
        [K in S]: T[K];
    },
};

type ActionType<T extends Record<string, unknown>, S extends keyof T> = SingleAcitionType<T, S> | MultiActionsType<T, S>;

function reducer<T extends Record<string, unknown>, S extends keyof T>(state: T, action: ActionType<T, S>): T {
    switch(action.type) {
        case 'set': return bindToModel({
            identifier: 'single',
            model: state,
            key: action.key,
            value: action.value,
        });
        case 'sets': return bindToModel({
            identifier: 'multi',
            model: state,
            binders: action.attributes,
        });
        default: return state;
    }
}

export default function usePortfolioModel<T extends Record<string, unknown>>(props: ModelType<T>){
    const [modelState, dispatchModel] = useReducer<T, [ActionType<T, keyof T>]>(reducer, props.model);

    return {
        model: modelState,
        dispatcher: dispatchModel,
    };
}