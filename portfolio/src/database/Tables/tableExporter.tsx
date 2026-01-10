import { type ColumnType, type ExpectedType } from './meta';

type ReferenceKeyType<S extends Record<string, ColumnType>> = {
    ColumnName: keyof S;
    TableName: {
        [K: string]: string;
    },
    CascadeDelete?: boolean;
};

export class Table<T extends Record<string, ColumnType>> {
    private tableName: string;
    private columnNames: T;
    private tableData: ExpectedType<T>[] = [];

    constructor(tableName: string, columns: T) {
        this.tableName = tableName;
        this.columnNames = columns;
    }

    set Add(columnData: ExpectedType<T>) {
        this.tableData.push(columnData);
    }

    set BulkAdd(data: ExpectedType<T>[]) {
        // let's verify whether the primary key is unique or not
        const primaryKeyData = this.isPrimaryKeyUnique(data);
        if(!primaryKeyData.isPrimaryKeyMismatched) {
            this.tableData = [...data];
        }
        else {
            const indexs: string = primaryKeyData.foundMismatchingIndexs.join(',');
            throw new Error('There are duplicated primary keys. The index(s) are: ' + indexs);
        }
    }

    addReferenceKeys(referenceKeys: ReferenceKeyType<T>[]) {
        referenceKeys.forEach(bindingItem => {
            const tableName = Object.keys(bindingItem.TableName)[0];
            const columnName = bindingItem.TableName[tableName as keyof typeof Tables] ?? '';
            if(this.columnNames && this.columnNames[bindingItem.ColumnName]) {
                this.columnNames[bindingItem.ColumnName]['BindToTable'] = {
                    TableName: tableName,
                    ColumnName: columnName.toString(),
                    DeleteOnCascade: bindingItem.CascadeDelete,
                };
            }
        });
    }

    get Rows() {
        return this.tableData;
    }

    get ColumnNames() {
        return this.columnNames;
    }

    get TableName() {
        return this.tableName;
    }

    private isPrimaryKeyUnique(data: ExpectedType<T>[]) {
        const foundMismatchingIndexs: number[] = [];
        let isPrimaryKeyMismatched: boolean = false;
        const addedPrimarykeyVaules: string[][] = [];
        const primaryKeyColumnNames: string[] = [];

        // getting primary key columns
        Object.keys(this.columnNames).forEach((key) => {
            if(this.columnNames[key].IsPrimaryKey) {
                primaryKeyColumnNames.push(this.columnNames[key].ColumnName);
            }
        });

        // getting added primary key values
        data.forEach((row) => {
            const primaryKeyValues: string[] = [];
            primaryKeyColumnNames.forEach(columnName => {
                if(columnName in row) {
                    primaryKeyValues.push(row[columnName as keyof ExpectedType<T>].toString());
                }
            });
            addedPrimarykeyVaules.push(primaryKeyValues);
        });

        // getting the primary key unique indexs
        for(let i = 0; i < addedPrimarykeyVaules.length - 1; i++) {
            addedPrimarykeyVaules[i].forEach((prKey, index) => {
                for(let j = i + 1; j < addedPrimarykeyVaules.length; j++){
                    if(prKey === addedPrimarykeyVaules[j][index]) {
                        isPrimaryKeyMismatched = true;
                        foundMismatchingIndexs.push(index);
                    }
                }
            });
        }

        return {
            isPrimaryKeyMismatched,
            foundMismatchingIndexs
        };
    }
}

export const Tables = {
    Projects: async () => {
        const project = await import('./TableDtos/Project');
        return {
            Pointer: project.Project,
            Columns: project.ProjectColumnNames
        };
    },
    Organization: async () => {
        const organization = await import('./TableDtos/Organization');
        return {
            Pointer: organization.Organization,
            Columns: organization.OrganizationColumnNames
        };
    },
    OrganizationAddress: async () => {
        const organizationAddress = await import('./TableDtos/Organization/OrganizationAddress');
        return {
            Pointer: organizationAddress.OrganizationAddress,
            Columns: organizationAddress.OrganizationAddressColumns
        };
    },
    utlOutlet: async () => {
        const utlOutlet = await import('./TableDtos/utlOutlet');
        return {
            Pointer: utlOutlet.utlOutlet,
            Columns: utlOutlet.utlOutletColumns
        };
    },
    utlContentView: async () => {
        const utlContentView = await import('./TableDtos/utlContentView');
        return {
            Pointer: utlContentView.utlContentView,
            Columns: utlContentView.utlContentViewColumns
        };
    },
    ContentView: async () => {
        const contentView = await import('./TableDtos/ContentView');
        return {
            Pointer: contentView.ContentView,
            Columns: contentView.ContentViewColumns,
        };
    },
};