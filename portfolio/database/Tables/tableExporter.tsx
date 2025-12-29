import { type ColumnType, type ExpectedType } from './meta';
import { Organization, OrganizationColumnNames } from './TableDtos/Organization';
import { OrganizationAddress, OrganizationAddressColumns } from './TableDtos/Organization/OrganizationAddress';
import { Project, ProjectColumnNames } from './TableDtos/Project';

export const Tables = {
    Projects: {
        Pointer: Project,
        Columns: ProjectColumnNames
    },
    Organization: {
        Pointer: Organization,
        Columns: OrganizationColumnNames
    },
    OrganizationAddress: {
        Pointer: OrganizationAddress,
        Columns: OrganizationAddressColumns
    }
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
            this.tableData = [...this.tableData, ...this.AlterdataConsideringForeignKeys(data)];
        }
        else {
            const indexs: string = primaryKeyData.foundMismatchingIndexs.join(',');
            throw new Error('There are duplicated primary keys. The index(s) are: ' + indexs);
        }
    }

    addReferenceKeys<S extends keyof typeof Tables>(referenceKeys: {
        ColumnName: keyof T;
        TableName: S;
        ReferencingColumn: keyof typeof Tables[S]['Columns'];
        CascadeDelete?: boolean;
    }[]) {
        referenceKeys.forEach(bindingItem => {
            if(this.columnNames && this.columnNames[bindingItem.ColumnName]) {
                this.columnNames[bindingItem.ColumnName]['BindToTable'] = {
                    TableName: bindingItem.TableName,
                    ColumnName: bindingItem.ReferencingColumn.toString(),
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
                primaryKeyValues.push(row[columnName].toString());
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

    private AlterdataConsideringForeignKeys(data: ExpectedType<T>[]) {
        const foundbindedColumnNames: {
            columnName: keyof T;
            TableName: keyof typeof Tables;
            referencingColumnName: string;
            index: number;
        }[] = [];
        const alteredData: ExpectedType<T>[] = [];

        // we have to remove deleted values if cascade option is selected
        // first let's find out what values are bounded as foreign keys
        Object.keys(this.columnNames).forEach((key, index) => {
            if(this.columnNames[key]['BindToTable']) {
                foundbindedColumnNames.push({
                    columnName: key,
                    TableName: this.columnNames[key]['BindToTable'].TableName,
                    referencingColumnName: this.columnNames[key]['BindToTable'].ColumnName,
                    index
                });
            }
        });

        if(!foundbindedColumnNames.length) return data;

        data.forEach(row => {
            foundbindedColumnNames.forEach(referenceColumns => {
                if(row[referenceColumns.columnName.toString()]) {
                    // let's get the data stored in that mentioned table
                    const referingTableData = Tables[referenceColumns.TableName].Pointer;
                    // let's go through that referecing table find if the value is there or not
                    if(referingTableData.length && this.isValueAvailable(row[referenceColumns.columnName.toString()], referingTableData, referenceColumns.referencingColumnName)){
                        alteredData.push(row);
                    }
                }
            });
        });

        return alteredData;
    }

    private isValueAvailable(value: string, referingTable: ExpectedType<Record<string, ColumnType>>[], columnName: string) {
        referingTable.forEach(row => {
            if(row[columnName.toString()]!.toString() === value) return true;
        });

        return false;
    }
}