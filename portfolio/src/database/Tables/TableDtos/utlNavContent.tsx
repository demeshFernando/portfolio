import { Table } from '../tableExporter';

const utlNavContentTable = new Table('utlNavContent', {
    NavContentID: {
        ColumnName: 'NavContentID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    Name: {
        ColumnName: 'Name',
        DataType: 'string',
        IsRequired: true
    },
    Description: {
        ColumnName: 'Description',
        DataType: 'string',
        IsRequired: true
    },
    IsActive: {
        ColumnName: 'IsActive',
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
utlNavContentTable.BulkAdd = [
    {
        NavContentID: 1,
        Name: 'Work',
        IsActive: true,
        SortOrder: 1,
        Description: 'This view will hold specifies to make the view suitable for the front end',
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    },
    {
        NavContentID: 2,
        Name: 'Undergraduate',
        IsActive: true,
        SortOrder: 2,
        Description: 'This view spcifies to make the view suitable for the undergraduate',
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    },
    {
        NavContentID: 3,
        Name: 'School',
        IsActive: true,
        SortOrder: 3,
        Description: 'This view specifies to make the view suitalbe for the Work related',
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    }
];

export const utlNavContentColumns = utlNavContentTable.ColumnNames;
export const utlNavContent = utlNavContentTable.Rows;