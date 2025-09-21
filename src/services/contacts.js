import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const newContact = await ContactsCollection.create(payload);
    return newContact;
};

export const deleteContact = async (contactId) => {
    const deletedContact = await ContactsCollection.findOneAndDelete({ _id: contactId });
    return deletedContact;
};

export const updateContact = async (contactId, payload, options = {}) => {
    const updatedContact = await ContactsCollection.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
            new: true,
            ...options,
        }
    );

    return updatedContact;
};
