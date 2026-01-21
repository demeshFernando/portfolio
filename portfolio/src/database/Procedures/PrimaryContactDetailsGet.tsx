/*
This function will be used to get the relevant primary contact details that are available in the table
Created Date: 2026-01-20
*/

import { Tables } from '../Tables/tableExporter';

type ContactType = {
    ContactID: number;
    ContactTypeID: number;
    Contact: string;
};

export default async function PrimaryContactsGet(): Promise<ContactType[]> {
    const returnResult: ContactType[] = [];
    const Contacts = (await Tables.Contact()).Pointer;
    const primaryContacts = Contacts.filter(contact => contact.IsPrimary);

    primaryContacts.map(primaryContact => returnResult.push({
        ContactID: primaryContact.ContactID,
        ContactTypeID: primaryContact.ContactTypeID,
        Contact: primaryContact.Contact
    }));

    return returnResult;
}