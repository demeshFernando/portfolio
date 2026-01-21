import { Table } from '../tableExporter';

const ContactTable = new Table('Contact', {
    ContactID: {
        ColumnName: 'ContactID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    ContactTypeID: {
        ColumnName: 'ContactTypeID',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'utlContactType',
            ColumnName: 'ContactTypeID',
            DeleteOnCascade: true,
        },
    },
    Contact: {
        ColumnName: 'Contact',
        DataType: 'string',
        IsRequired: true
    },
    IsPrimary: {
        ColumnName: 'IsPrimary',
        DataType: 'bool',
        IsRequired: true,
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
ContactTable.BulkAdd = [
    {
        ContactID: 1,
        ContactTypeID: 2,
        Contact: '(077) 048 6069',
        IsPrimary: true,
        DateInserted: new Date('2026-01-19'),
        DateUpdated: new Date('2026-01-19')
    },
    {
        ContactID: 2,
        ContactTypeID: 1,
        Contact: 'wdemeshfernando@gmail.com',
        IsPrimary: true,
        DateInserted: new Date('2026-01-19'),
        DateUpdated: new Date('2026-01-19')
    },
    {
        ContactID: 3,
        ContactTypeID: 3,
        Contact: '',
        IsPrimary: true,
        DateInserted: new Date('2026-01-19'),
        DateUpdated: new Date('2026-01-19')
    }
];

export const ContactColumns = ContactTable.ColumnNames;
export const Contact = ContactTable.Rows;