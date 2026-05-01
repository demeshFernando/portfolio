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
        Description: 'VitalHub is a canada-based healthcare technology company that provides software solutions for health and human services organizations. Founded in 2010 and headquatered in Toronto. VitalHub develops products that support areas such electronic health records (EHR), patient flow and operational visibility, case management, care coordination, and worforce automation. its solutions are widely used by hospitals long-term care providers, community and social srevices, and mental health organizations across Canada, the UK, and other international markets.<br />The company focuses on improving clinical workflows, decision-making, and care outcomes through integrated, user-friendly digital platforms, and serves over 1,000 healthcare organizations globally. VitalHub is a publicly traded company (TSX: VHI) and follows a growth strategy that combines product innovation with strategic acquisitions in the health IT space.',
        DateInserted: new Date('2025-12-28'),
        DateUpdated: new Date('2026-04-14')
    }
];

export const OrganizationColumnNames = organizationTable.ColumnNames;
export const Organization = organizationTable.Rows;