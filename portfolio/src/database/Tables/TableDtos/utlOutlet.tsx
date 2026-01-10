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
        Description: '',
        DateInserted: new Date('2025-12-29'),
        DateUpdated: new Date('2025-12-29')
    }
];

export const utlOutletColumns = utlOutletTable.ColumnNames;
export const utlOutlet = utlOutletTable.Rows;