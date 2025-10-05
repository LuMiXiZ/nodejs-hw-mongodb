import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({ userId, page, perPage, sortBy = 'name', sortOrder = SORT_ORDER.ASC, filter = {} }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find({ userId });

    if (filter.type) {
        contactsQuery.where('contactType').equals(filter.type);
    }
    if (filter.isFavourite !== undefined) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [contactsCount, contacts] = await Promise.all([
        ContactsCollection.find().merge(contactsQuery).countDocuments(),
        contactsQuery
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactById = async (userId, contactId) => {
    const contact = await ContactsCollection.findOne({ _id: contactId, userId });
    return contact;
};

export const createContact = async (payload) => {
    const newContact = await ContactsCollection.create(payload);
    return newContact;
};

export const deleteContact = async (userId, contactId) => {
    const deletedContact = await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
    return deletedContact;
};

export const updateContact = async (userId, contactId, payload, options = {}) => {
    const updatedContact = await ContactsCollection.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        {
            new: true,
            ...options,
        }
    );

    return updatedContact;
};
