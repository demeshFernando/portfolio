import { Table } from '../tableExporter';

const utlOutletUtlOutletCategoriesTable = new Table('utlOutletCategories', {
    OutletOutletCategoriesID: {
        ColumnName: 'OutletOutletCategoriesID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    OutletCategoriesID: {
        ColumnName: 'CategoryName',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'utlOutletCategories',
            ColumnName: 'OutletCategoriesID',
            DeleteOnCascade: true
        },
    },
    OutletID: {
        ColumnName: 'OutletID',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'utlOutlet',
            ColumnName: 'OutletID',
            DeleteOnCascade: true
        },
    },
    IsActive: {
        ColumnName: 'IsActive',
        DataType: 'bool',
        IsRequired: true
    },
    Priority: {
        ColumnName: 'Priority',
        DataType: 'int',
        IsRequired: true
    },
    DateInserted: {
        ColumnName: 'DateInserted',
        DataType: 'dateTime',
        IsRequired: true
    },
    DateUpdated: {
        ColumnName: 'DateUpdated',
        DataType: 'dateTime',
        IsRequired: true
    },
});
utlOutletUtlOutletCategoriesTable.BulkAdd = [
    {
        OutletOutletCategoriesID: 1,
        OutletCategoriesID: 1,
        OutletID: 1,
        IsActive: true,
        Priority: 2,
        DateInserted: new Date('2026-01-14'),
        DateUpdated: new Date('2026-01-14')
    },
    {
        OutletOutletCategoriesID: 2,
        OutletCategoriesID: 2,
        OutletID: 1,
        Priority: 1,
        IsActive: true,
        DateInserted: new Date('2026-01-14'),
        DateUpdated: new Date('2026-01-14')
    }
];

export const utlOutletUtlOutletCategoriesColumns = utlOutletUtlOutletCategoriesTable.ColumnNames;
export const utlOutletUtlOutletCategories = utlOutletUtlOutletCategoriesTable.Rows;