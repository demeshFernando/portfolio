import { Table } from '../tableExporter';

const projectTable = new Table('Project', {
    ProjectID: {
        ColumnName: 'ProjectID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    ProjectName: {
        ColumnName: 'ProjectName',
        DataType: 'string',
        IsRequired: true
    },
    StartDate: {
        ColumnName: 'StartDate',
        DataType: 'dateTime',
        IsRequired: true
    },
    EndDate: {
        ColumnName: 'EndDate',
        DataType: 'dateTime',
    },
    OrganizationID: {
        ColumnName: 'OrganizationID',
        DataType: 'int'
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
projectTable.addReferenceKeys([
    {
        ColumnName: 'OrganizationID',
        TableName: {
            'Organization': 'OrganizationID',
        },
        CascadeDelete: true,
    }
]);
projectTable.BulkAdd = [];

export const ProjectColumnNames = projectTable.ColumnNames;
export const Project = projectTable.Rows;