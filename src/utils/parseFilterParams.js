const parseContactType = (contactType) => {
    const isString = typeof contactType === 'string';
    if (!isString) return;

    const type = (contactType) => ['personal', 'work', 'home'].includes(contactType);

    if (type(contactType)) return contactType;
};

const parseFavourite = (isFavourite) => {
    if (typeof isFavourite === 'string') {
        const normalized = isFavourite.toLowerCase();

        if (normalized === 'true' || normalized === '1') return true;
        if (normalized === 'false' || normalized === '0') return false;
    }

    if (typeof isFavourite === 'number') {
        if (isFavourite === 1) return true;
        if (isFavourite === 0) return false;
    }

    return undefined; // некоректне значення
};

export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;

    const parsedContactType = parseContactType(type);
    const parsedIsFavourite = parseFavourite(isFavourite);

    return {
        type: parsedContactType,
        isFavourite: parsedIsFavourite,
    };
};
