import { Table } from '../tableExporter';

const utlOutletTable = new Table('utlOutlet', {
    OutletID: {
        ColumnName: 'OutletID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    OutletName: {
        ColumnName: 'OutletName',
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
utlOutletTable.BulkAdd = [
    {
        OutletID: 1,
        OutletName: 'General',
        Description: 'Generally what I do',
        DateInserted: new Date('2025-12-29'),
        DateUpdated: new Date('2025-12-29')
    },
    {
        OutletID: 2,
        OutletName: 'Software Engineer',
        Description: 'My work as a Software Engineer',
        DateInserted: new Date('2026-02-14'),
        DateUpdated: new Date('2026-02-14')
    }
];

export const utlOutletColumns = utlOutletTable.ColumnNames;
export const utlOutlet = utlOutletTable.Rows;