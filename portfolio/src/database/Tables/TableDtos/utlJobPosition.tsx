import { Table } from '../tableExporter';

const utlJobPositionTable = new Table('utlJobPosition', {
    PositionID: {
        ColumnName: 'PositionID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    Position: {
        ColumnName: 'Position',
        DataType: 'string',
        IsRequired: true
    },
    StartDate: {
        ColumnName: 'StartDate',
        DataType: 'dateTime',
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
utlJobPositionTable.BulkAdd = [
    {
        PositionID: 1,
        Position: 'Recovery Officer',
        StartDate: new Date('2020-05-01'),
        DateInserted: new Date('2026-01-20'),
        DateUpdated: new Date('2026-01-20'),
    },
    {
        PositionID: 2,
        Position: 'Intern Software Developer',
        StartDate: new Date('2024-05-01'),
        DateInserted: new Date('2026-01-21'),
        DateUpdated: new Date('2026-01-21'),
    },
    {
        PositionID: 3,
        Position: 'Trainee Software Engineer',
        StartDate: new Date('2024-12-01'),
        DateInserted: new Date('2026-01-21'),
        DateUpdated: new Date('2026-01-21'),
    },
    {
        PositionID: 4,
        Position: 'Associate Software Engineer',
        StartDate: new Date('2026-01-01'),
        DateInserted: new Date('2026-01-21'),
        DateUpdated: new Date('2026-01-21'),
    }
];

export const utlJobPositionColumnNames = utlJobPositionTable.ColumnNames;
export const utlJobPosition = utlJobPositionTable.Rows;