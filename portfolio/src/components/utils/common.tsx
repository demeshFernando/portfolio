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

export function bindToModel<T extends Record<string, unknown>, S extends keyof T>(props: ModelProps<T, S>): T{
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

export async function executeCollectionFetcher<T extends Record<string, unknown>>(fetchFn: () => Promise<T[]>): Promise<T[]> {
    try {
        //let's try executing the function
        const results = await fetchFn();
        return results;
    } catch (E) {
        throw 'Cannot fetch ' + E;
    }
}

export function isNumber(value: unknown): value is number {
    try {
        return !!Number(value);
    } catch {
        return false;
    }
}