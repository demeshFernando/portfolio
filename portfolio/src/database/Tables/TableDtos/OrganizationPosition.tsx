import { Table } from '../tableExporter';

const OrganizationPositionTable = new Table('OrganizationPosition', {
    OrganizationPositionID: {
        ColumnName: 'OrganizationPositionID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    PositionID: {
        ColumnName: 'PositionID',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'utlJobPosition',
            ColumnName: 'PositionID',
            DeleteOnCascade: true,
        },
    },
    OrganizationID: {
        ColumnName: 'OrganizationID',
        DataType: 'int',
        IsRequired: true,
        BindToTable: {
            TableName: 'Organization',
            ColumnName: 'OrganizationID',
            DeleteOnCascade: true,
        },
    },
    StartedDate: {
        ColumnName: 'StartedDate',
        DataType: 'dateTime',
        IsRequired: true
    },
    EndedDate: {
        ColumnName: 'EndedDate',
        DataType: 'dateTime'
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
OrganizationPositionTable.BulkAdd = [
    {
        OrganizationPositionID: 1,
        PositionID: 1,
        OrganizationID: 1,
        StartedDate: new Date('2020-05-01'),
        EndedDate: new Date('2021-05-30'),
        DateInserted: new Date('2026-01-21'),
        DateUpdated: new Date('2026-01-21'),
    },
    {
        OrganizationPositionID: 2,
        PositionID: 2,
        OrganizationID: 2,
        StartedDate: new Date('2024-05-01'),
        EndedDate: new Date('2024-11-31'),
        DateInserted: new Date('2026-01-21'),
        DateUpdated: new Date('2026-01-21'),
    },
    {
        OrganizationPositionID: 3,
        PositionID: 3,
        OrganizationID: 2,
        StartedDate: new Date('2024-12-01'),
        EndedDate: new Date('2025-12-31'),
        DateInserted: new Date('2026-01-21'),
        DateUpdated: new Date('2026-01-21'),
    },
    {
        OrganizationPositionID: 4,
        PositionID: 4,
        OrganizationID: 2,
        StartedDate: new Date('2026-01-01'),
        DateInserted: new Date('2026-01-21'),
        DateUpdated: new Date('2026-01-21'),
    }
];

export const OrganizationPositionColumnNames = OrganizationPositionTable.ColumnNames;
export const OrganizationPosition = OrganizationPositionTable.Rows;