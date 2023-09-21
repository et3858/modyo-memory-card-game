export type CardType = {
    type: string,
    image: string,
};

export type EntryCardType = {
    fields: { image: { url: string } },
    meta: { slug: string },
};
