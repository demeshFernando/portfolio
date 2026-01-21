import { Table } from '../tableExporter';

const utlContactTypeTable = new Table('utlContactType', {
    ContactTypeID: {
        ColumnName: 'ContactTypeID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    ContactName: {
        ColumnName: 'ContactName',
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
utlContactTypeTable.BulkAdd = [
    {
        ContactTypeID: 1,
        ContactName: 'Email',
        DateInserted: new Date('2026-01-19'),
        DateUpdated: new Date('2026-01-19')
    },
    {
        ContactTypeID: 2,
        ContactName: 'Phone',
        DateInserted: new Date('2026-01-19'),
        DateUpdated: new Date('2026-01-19')
    },
    {
        ContactTypeID: 3,
        ContactName: 'Link',
        DateInserted: new Date('2026-01-19'),
        DateUpdated: new Date('2026-01-19')
    }
];

export const utlContactTypeColumns = utlContactTypeTable.ColumnNames;
export const utlContactType = utlContactTypeTable.Rows;