import { Table } from '../tableExporter';

const organizationTable = new Table('Organization', {
    OrganizationID: {
        ColumnName: 'OrganizationID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true,
    },
    OrganizationName: {
        ColumnName: 'OrganizationName',
        DataType: 'string',
        IsRequired: true
    },
    DateJoined: {
        ColumnName: 'DateJoined',
        DataType: 'dateTime',
        IsRequired: true
    },
    DateResigned: {
        ColumnName: 'DateResigned',
        DataType: 'dateTime',
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
organizationTable.BulkAdd = [
    {
        OrganizationID: 1,
        OrganizationName: 'Brescia Grameen PVT. LTD.',
        DateJoined: new Date('2020-05-01'),
        DateResigned: new Date('2021-05-01'),
        Description: 'I worked here as a Recorvery Officer. And in that role I have to collect monthly due amount from customer\'s loan amount and also filing cases if they failed to pay.',
        DateInserted: new Date('2025-12-28'),
        DateUpdated: new Date('2025-12-28')
    },
    {
        OrganizationID: 2,
        OrganizationName: 'Vitalhub PVT. LTD.',
        DateJoined: new Date('2024-05-08'),
        Description: '',
        DateInserted: new Date('2025-12-28'),
        DateUpdated: new Date('2025-12-28')
    }
];

export const OrganizationColumnNames = organizationTable.ColumnNames;
export const Organization = organizationTable.Rows;