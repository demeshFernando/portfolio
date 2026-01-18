import { Table } from '../tableExporter';

const OutletNavContentTable = new Table('OutletNavContent', {
    OutletNavContentID: {
        ColumnName: 'OutletNavContentID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
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
            DeleteOnCascade: true
        },
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
OutletNavContentTable.BulkAdd = [
    {
        OutletNavContentID: 1,
        OutletID: 1,
        NavID: 1,
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    },
    {
        OutletNavContentID: 2,
        OutletID: 1,
        NavID: 2,
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    },
    {
        OutletNavContentID: 3,
        OutletID: 1,
        NavID: 3,
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    }
];

export const OutletNavContentColumns = OutletNavContentTable.ColumnNames;
export const OutletNavContent = OutletNavContentTable.Rows;