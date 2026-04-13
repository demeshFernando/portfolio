import { Table } from '../tableExporter';

const ContentViewTable = new Table('ContentView', {
    ContentViewID: {
        ColumnName: 'ContentViewID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    ContentUtlViewID: {
        ColumnName: 'ContentUtlViewID',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'utlContentView',
            ColumnName: 'ContentViewID',
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
    NavID: {
        ColumnName: 'NavID',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'utlNavContent',
            ColumnName: 'NavContentID',
            DeleteOnCascade: true,
        },
    },
    IsVisible: {
        ColumnName: 'IsVisible',
        DataType: 'bool',
        IsRequired: true
    },
    SortOrder: {
        ColumnName: 'SortOrder',
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
ContentViewTable.BulkAdd = [
    {
        ContentViewID: 1,
        ContentUtlViewID: 1,
        OutletID: 1,
        NavID: 1,
        IsVisible: true,
        SortOrder: 3,
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04'),
    },
    {
        ContentViewID: 2,
        ContentUtlViewID: 2,
        IsVisible: true,
        OutletID: 1,
        NavID: 1,
        SortOrder: 2,
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    },
    {
        ContentViewID: 3,
        ContentUtlViewID: 3,
        IsVisible: true,
        OutletID: 1,
        NavID: 1,
        SortOrder: 1,
        DateInserted: new Date('2026-01-16'),
        DateUpdated: new Date('2026-01-16')
    }
];

export const ContentViewColumns = ContentViewTable.ColumnNames;
export const ContentView = ContentViewTable.Rows;