import { Table } from '../tableExporter';

const utlContentViewTable = new Table('utlContentView', {
    ContentViewID: {
        ColumnName: 'ContentViewID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    ContentName: {
        ColumnName: 'ContentName',
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
utlContentViewTable.BulkAdd = [
    {
        ContentViewID: 1,
        ContentName: 'School',
        Description: 'This view will hold specifies to make the view suitable for the front end',
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    },
    {
        ContentViewID: 2,
        ContentName: 'Undergraduate',
        Description: 'This view spcifies to make the view suitable for the undergraduate',
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    },
    {
        ContentViewID: 3,
        ContentName: 'Work',
        Description: 'This view specifies to make the view suitalbe for the Work related',
        DateInserted: new Date('2026-01-04'),
        DateUpdated: new Date('2026-01-04')
    }
];

export const utlContentViewColumns = utlContentViewTable.ColumnNames;
export const utlContentView = utlContentViewTable.Rows;