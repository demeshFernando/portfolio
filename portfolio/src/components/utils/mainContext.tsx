import { createContext, useContext, type ReactNode } from 'react';
import { usePortfolioModelWithSilent } from '../Hooks/usePortfolioModel';
import { configs } from './application.config';

type ContextModelType = {
    SourceID: number;
    DisableButtons: boolean;
    DisableMessageTitle: string;
    DisableSourceLoader: boolean;
    MajorSourceIdsLoaded: {
        isNavsLoaded: boolean;
        isFocusedContentLoaded: boolean;
        isBottomContentLoaded: boolean;
    };
};

type MultiPushType = {
    [K in keyof ContextModelType]?: ContextModelType[K];
};

type ContextType = {
    Model: ContextModelType;
    SilentModel: typeof configs;
    Push: <S extends keyof ContextModelType>(key: S, value: ContextModelType[S]) => void;
    pushes: (keyValuePair: MultiPushType) => void;
    Pop: <S extends keyof ContextModelType>(key: S) => ContextModelType[S];
    getConfigItem: <S extends keyof typeof configs>(key: S) => typeof configs[S];
    HasContextItemChanged: (key?: keyof ContextModelType) => boolean;
    neurtrilizeContext: (key?: keyof ContextModelType) => void;
};

const ContextInitializer = createContext<ContextType | null>(null);

export function BaseContextProvider(props: { children: ReactNode }){
    const { model: contextModel, silentModel: contextSilentModel } = usePortfolioModelWithSilent<ContextModelType, typeof configs>({
        model: {
            SourceID: 1,
            DisableButtons: false,
            DisableMessageTitle: 'This was disabled by the administration.',
            DisableSourceLoader: true,
            MajorSourceIdsLoaded: {
                isNavsLoaded: true,
                isFocusedContentLoaded: true,
                isBottomContentLoaded: true,
            },
        },
        silentModel: configs
    });

    const Push = <S extends keyof ContextModelType>(key: S, value: ContextModelType[S]) => {
        if(key in contextModel.model){
            contextModel.helpers.binders.setToModel(key, value);
        }
    };

    const pushes = (keyValuePair: MultiPushType) => {
        contextModel.helpers.binders.setsToModel(keyValuePair);
    };

    const Pop = <S extends keyof ContextModelType>(key: S) => {
        return contextModel.model[key];
    };

    const HasContextItemChanged = contextModel.helpers.hasModelChanged;
    const neurtrilizeContext = contextModel.helpers.neutrlizeModel;

    const getConfigItem = <S extends keyof typeof configs>(key: S) => {
        return contextSilentModel.binders.getValue(key);
    };

    return <ContextInitializer.Provider value={{ Model: contextModel.model, SilentModel: contextSilentModel.silentModel.current, Push, pushes, Pop, getConfigItem, HasContextItemChanged, neurtrilizeContext }}>
        {props.children}
    </ContextInitializer.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBaseStorage() {
    const context = useContext(ContextInitializer);
    return context;
}