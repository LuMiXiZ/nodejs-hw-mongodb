import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({ page, perPage, sortBy = 'name', sortOrder = SORT_ORDER.ASC }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();
    const contactsCount = await ContactsCollection.find()
        .merge(contactsQuery)
        .countDocuments();

    const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
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
