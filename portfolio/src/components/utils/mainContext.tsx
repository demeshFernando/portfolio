import { createContext, useContext, type ReactNode } from 'react';
import { usePortfolioModelWithSilent } from '../Hooks/usePortfolioModel';
import { configs } from './application.config';

type ContextModelType = {
    SourceID: number;
    DisableButtons: boolean;
    DisableMessageTitle: string;
};

type ContextType = {
    Model: ContextModelType;
    SilentModel: typeof configs;
    Push: <S extends keyof ContextModelType>(key: S, value: ContextModelType[S]) => void;
    Pop: <S extends keyof ContextModelType>(key: S) => ContextModelType[S];
    getConfigItem: <S extends keyof typeof configs>(key: S) => typeof configs[S];
};

const ContextInitializer = createContext<ContextType | null>(null);

export function BaseContextProvider(props: { children: ReactNode }){
    const { model: contextModel, silentModel: contextSilentModel } = usePortfolioModelWithSilent<ContextModelType, typeof configs>({
        model: {
            SourceID: 1,
            DisableButtons: false,
            DisableMessageTitle: 'This was disabled by the administration.'
        },
        silentModel: configs
    });

    const Push = <S extends keyof ContextModelType>(key: S, value: ContextModelType[S]) => {
        if(key in configs){
            contextModel.helpers.binders.setToModel(key, value);
        }
    };

    const Pop = <S extends keyof ContextModelType>(key: S) => {
        return contextModel.model[key];
    };

    const getConfigItem = <S extends keyof typeof configs>(key: S) => {
        return contextSilentModel.binders.getValue(key);
    };

    return <ContextInitializer.Provider value={{ Model: contextModel.model, SilentModel: contextSilentModel.silentModel.current, Push, Pop, getConfigItem }}>
        {props.children}
    </ContextInitializer.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBaseStorage() {
    const context = useContext(ContextInitializer);
    return context;
}