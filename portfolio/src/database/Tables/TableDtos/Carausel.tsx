import { Table } from '../tableExporter';
import { EsoftMetroCampus } from './imgBlobs/CarauselImgs/esoftImg';
import { JavaInstitute } from './imgBlobs/CarauselImgs/javaInstituteImg';
import { NSBMImg } from './imgBlobs/CarauselImgs/nsbmImg';
import { schoolImg } from './imgBlobs/CarauselImgs/schoolImg';
import { vitalhubImg } from './imgBlobs/CarauselImgs/vitalhubImg';

const CarauselTable = new Table('Carausel', {
    CarauselID: {
        ColumnName: 'CarauselID',
        DataType: 'int',
        IsPrimaryKey: true,
        IsIdentityColumn: true
    },
    ImgBlob: {
        ColumnName: 'ImgBlob',
        DataType: 'string',
        IsRequired: true,
    },
    Header: {
        ColumnName: 'Header',
        DataType: 'string',
        IsRequired: true
    },
    SubHeader: {
        ColumnName: 'SubHeader',
        DataType: 'string',
        IsRequired: true,
    },
    Body: {
        ColumnName: 'Body',
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
CarauselTable.BulkAdd = [
    {
        CarauselID: 1,
        ImgBlob: schoolImg,
        Header: 'School',
        SubHeader: 'From 2006 - 2019',
        Body: 'Attended from 2006 - 2019 in st.Peter\'s College. Completed my advanced level examination in physical science stream with 2C and an A',
        DateInserted: new Date('2026-02-7'),
        DateUpdated: new Date('2026-2-7')
    },
    {
        CarauselID: 2,
        ImgBlob: EsoftMetroCampus,
        Header: 'Diploma in IT',
        SubHeader: 'DITEC (Dec, 2016 - Dec, 2017)',
        Body: 'Completed a diploma in Esoft metro campus during the post ordinary level break season.',
        DateInserted: new Date('2026-02-7'),
        DateUpdated: new Date('2026-2-7')
    },
    {
        CarauselID: 3,
        ImgBlob: JavaInstitute,
        Header: 'Diploma in SE',
        SubHeader: 'From May, 2020 - May, 2021',
        Body: 'Completed a diploma in Software Engineering with the schorlaship I won by passing an exam they did.',
        DateInserted: new Date('2026-02-7'),
        DateUpdated: new Date('2026-2-7')
    },
    {
        CarauselID: 4,
        ImgBlob: NSBMImg,
        Header: 'BSC In SE',
        SubHeader: 'From May, 2021 - Dec, 2025',
        Body: 'Completed an honours degree program in NSBM with a first class pass.',
        DateInserted: new Date('2026-02-7'),
        DateUpdated: new Date('2026-2-7')
    },
    {
        CarauselID: 5,
        ImgBlob: vitalhubImg,
        Header: 'Associate SE',
        SubHeader: 'Associate SE (May, 5 2024 - Present)',
        Body: 'After completing the internship at vitalhub as a Software Engineer, got promoted as an associate Software engineer and currently continuing the occupation',
        DateInserted: new Date('2026-02-7'),
        DateUpdated: new Date('2026-2-7')
    }
];

export const CarauselColumns = CarauselTable.ColumnNames;
export const Carausel = CarauselTable.Rows;