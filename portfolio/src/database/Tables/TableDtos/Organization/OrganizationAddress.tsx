import { Table } from '../../tableExporter';

const organizationAddressTable = new Table('OrganizationAddress', {
    OrganizationAddressID: {
        ColumnName: 'OrganizationAddressID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    AddressLane1: {
        ColumnName: 'AddressLane01',
        DataType: 'string',
        IsRequired: true
    },
    AddressLane02: {
        ColumnName: 'AddressLane02',
        DataType: 'string',
        IsRequired: true
    },
    City: {
        ColumnName: 'City',
        DataType: 'string'
    },
    OrganizationID: {
        ColumnName: 'OrganizationID',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'Organization',
            ColumnName: 'OrganizationID',
            DeleteOnCascade: true
        }
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
organizationAddressTable.BulkAdd = [];

export const OrganizationAddressColumns = organizationAddressTable.ColumnNames;
export const OrganizationAddress = organizationAddressTable.Rows;