import { createContext, useContext, type ReactNode } from 'react';
import { usePortfolioModel } from '../Hooks/usePortfolioModel';

type ContextModelType = {
    SourceID: number;
};

type ContextType = {
    Model: ContextModelType,
    Push: <S extends keyof ContextModelType>(key: S, value: ContextModelType[S]) => void;
    Pop: <S extends keyof ContextModelType>(key: S) => ContextModelType[S];
};

const ContextInitializer = createContext<ContextType | null>(null);

export function BaseContextProvider(props: { children: ReactNode }){
    const { model: contextModel, helpers: contextHelper } = usePortfolioModel<ContextModelType>({
        model: {
            SourceID: 1,
        }
    });

    const Push = <S extends keyof ContextModelType>(key: S, value: ContextModelType[S]) => {
        contextHelper.binders.setToModel(key, value);
    };

    const Pop = <S extends keyof ContextModelType>(key: S) => {
        return contextModel[key];
    };

    return <ContextInitializer.Provider value={{ Model: contextModel, Push, Pop }}>
        {props.children}
    </ContextInitializer.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBaseStorage() {
    const context = useContext(ContextInitializer);
    return context;
}