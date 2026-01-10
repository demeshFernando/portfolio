export type ColumnType = {
    ColumnName: string;
    DataType: 'string' | 'int' | 'dateTime' | 'bool';
    IsPrimaryKey?: boolean;
    IsIdentityColumn?: boolean;
    IdentityIncrementCounter?: number;
    IsRequired?: boolean;
    BindToTable?: {
        TableName: string;
        ColumnName: string;
        DeleteOnCascade?: boolean;
    };
};

type DataType = {
    string: string;
    int: number;
    dateTime: Date;
    bool: boolean;
};
export type ColumnDataType<C extends ColumnType> = DataType[C['DataType']];
type RequiredPart<T extends Record<string, ColumnType>> = {
    [K in keyof T as T[K]['IsRequired'] extends true ? K : never]: ColumnDataType<T[K]>
};
type OptionalPart<T extends Record<string, ColumnType>> = {
    [K in keyof T as T[K]['IsRequired'] extends true ? never : K]?: ColumnDataType<T[K]>
};

type IdentityInsertionpart<T extends Record<string, ColumnType>> = {
    [K in keyof T as T[K]['IsIdentityColumn'] extends true ? K : never]: ColumnDataType<T[K]>
};

export type ExpectedType<T extends Record<string, ColumnType>> = IdentityInsertionpart<T> & RequiredPart<T> & OptionalPart<T>;