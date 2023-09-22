export type TCard = {
    type: string,
    image: string,
};

export type TEntryCard = {
    fields: { image: { url: string } },
    meta: { slug: string },
};
