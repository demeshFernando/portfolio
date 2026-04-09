import { useCallback, useEffect, useReducer, useRef } from 'react';

import { common } from '../utils/common';

type ModelType<T extends Record<string, unknown>> = {
    model: T,
    helperAttributes?: {
        fetchFn?: () => Promise<T>;
    },
};

type ModelTypeWithSilent<T extends Record<string, unknown>, S extends Record<string, unknown>> = {
    silentModel: S,
} & ModelType<T>;

type SingleAcitionType<T extends Record<string, unknown>, S extends keyof T> = {
    type: 'set',
    key: S,
    value: T[S],
};

type MultiActionsType<T extends Record<string, unknown>, S extends keyof T> = {
    type: 'sets',
    attributes: {
        [K in S]?: T[K];
    },
};

type ActionType<T extends Record<string, unknown>, S extends keyof T> = SingleAcitionType<T, S> | MultiActionsType<T, S>;

function startNeutrilizingModel<T extends Record<string, unknown>>(model: T, initialModel: T, neutrilizingKey?: keyof T): T {
    if(neutrilizingKey) {
        return {
            ...initialModel,
            [neutrilizingKey]: model[neutrilizingKey],
        };
    }
    return { ...model };
}

function reducer<T extends Record<string, unknown>, S extends keyof T>(state: T, action: ActionType<T, S>): T {
    switch(action.type) {
        case 'set': return common.bindToModel({
            identifier: 'single',
            model: { ...state },
            key: action.key,
            value: action.value,
        });
        case 'sets': return common.bindToModel({
            identifier: 'multi',
            model: { ...state },
            binders: { ...action.attributes },
        });
        default: return state;
    }
}

export function usePortfolioModel<T extends Record<string, unknown>>(props: ModelType<T>){
    const [modelState, dispatchModel] = useReducer<T, [ActionType<T, keyof T>]>(reducer, props.model);
    const initialModel = useRef<T>(props.model);
    const fetchModel = useRef({
        fetch: false,
    });

    const setToModel = <S extends keyof T>(key: S, value: T[S]) => {
        if(modelState[key] !== value)
            dispatchModel({ type: 'set', key: key, value: value });
    };

    const setsToModel = (attributes: { [K in keyof T]?: T[K] }) => {
        const attributesLength = Object.keys(attributes).length;
        const changedModelAttributes = Object.keys(attributes).filter(key => modelState[key] !== attributes[key]);
        if(changedModelAttributes.length > 0 && attributesLength === changedModelAttributes.length){
            dispatchModel({ type: 'sets', attributes });
        }
    };

    const hasModelChanged = useCallback((key?: keyof T): boolean => {
        let hasChanged = false;
        if(!initialModel && !modelState) return false;

        if(key) {
            return initialModel.current![key] !== modelState![key];
        }

        Object.keys(modelState!).forEach(key => {
            if(modelState![key] !== initialModel.current![key]) {
                hasChanged = true;
            }
        });

        return hasChanged;
    }, [modelState]);

    const neutrlizeModel = useCallback((neutrilizingKey?: keyof T) => {
        if(!modelState && !initialModel) return;
        const neutrilizedModel = startNeutrilizingModel(modelState!, initialModel.current!, neutrilizingKey);
        initialModel.current = neutrilizedModel;
    }, [modelState]);

    useEffect(() => {
        const startFetchingModel = async () => {
            if(props.helperAttributes && props.helperAttributes.fetchFn) {
                try {
                    const results = await props.helperAttributes.fetchFn();
                    if(results) {
                        dispatchModel({
                            type: 'sets',
                            attributes: results,
                        });
                    }
                } catch (E) {
                    throw 'error found in fetching the model ' + E;
                }
            }
            fetchModel.current.fetch = false;
        };

        if(fetchModel.current.fetch) startFetchingModel();
    }, [fetchModel, fetchModel.current.fetch, props.helperAttributes]);

    return {
        model: modelState,
        dispatcher: dispatchModel,
        helpers: {
            fetchModel,
            binders: { setToModel, setsToModel },
            neutrlizeModel,
            hasModelChanged
        },
    };
}

export function usePortfolioModelWithSilent<T extends Record<string, unknown>, S extends Record<string, unknown>>(props: ModelTypeWithSilent<T, S>) {
    const { model, dispatcher, helpers } = usePortfolioModel({
        model: props.model,
        helperAttributes: props.helperAttributes
    });
    const { silentModel, binders, silentModelHelper } = usePortfolioSilentModel({
        model: props.silentModel
    });

    return {
        model: {
            model, dispatcher, helpers
        },
        silentModel: {
            silentModel, binders, silentModelHelper
        },
    };
}

type SilentModelType<T extends Record<string, unknown> | null> = {
    model: T
};
export function usePortfolioSilentModel<T extends Record<string, unknown>>(props: SilentModelType<T>){
    const silentModel = useRef<T>(props.model);
    const initialModel = useRef<T>(props.model);

    const binders = {
        setToModel: <S extends keyof T>(key: S, value: T[S]) => {
            silentModel.current[key] = value;
        },
        setsToModel: <S extends keyof T>(attributes: { [K in S]?: T[K] }) => {
            silentModel.current = {
                ...silentModel.current,
                ...attributes,
            };
        },
        getValue: <S extends keyof T>(key: S): T[S] => {
            return silentModel.current[key];
        },
    };

    const helper = {
        hasSilentModelChanged: (key?: keyof T) => {
            if(key) {
                return initialModel.current[key] !== silentModel.current[key];
            }

            Object.keys(initialModel.current).forEach(key => {
                if(initialModel.current[key] === silentModel.current[key]) return false;
            });

            return false;
        },

        neutrilizeSilentModel: (key?: keyof T) => {
            if(key) initialModel.current[key] = silentModel.current[key];

            initialModel.current = { ...silentModel.current };
        },
    };

    return {
        silentModel,
        binders,
        silentModelHelper: helper,
    };
}