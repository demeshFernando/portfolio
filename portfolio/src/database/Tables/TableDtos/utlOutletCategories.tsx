import { Table } from '../tableExporter';

const utlOutletCategoriesTable = new Table('utlOutletCategories', {
    OutletCategoriesID: {
        ColumnName: 'OutletCategoriesID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    CategoryName: {
        ColumnName: 'CategoryName',
        DataType: 'string',
        IsRequired: true
    },
    Description: {
        ColumnName: 'Description',
        DataType: 'string',
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
utlOutletCategoriesTable.BulkAdd = [
    {
        OutletCategoriesID: 1,
        CategoryName: 'General',
        Description: 'Every category fall under this one',
        DateInserted: new Date('2026-01-14'),
        DateUpdated: new Date('2026-01-14')
    },
    {
        OutletCategoriesID: 2,
        CategoryName: 'Software Engineering',
        Description: 'Software Engineering related categories are fall under this one',
        DateInserted: new Date('2026-01-14'),
        DateUpdated: new Date('2026-01-14')
    }
];

export const utlOutletCategoriesColumns = utlOutletCategoriesTable.ColumnNames;
export const utlOutletCategories = utlOutletCategoriesTable.Rows;