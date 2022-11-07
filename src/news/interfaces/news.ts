import { Tag } from './tag';

export interface News {
    id: string;
    title: string;
    body: string;
    coverImg: string | null;
    metaTitle: string;
    metaExcerpt: string;
    slug: string;
    metaImg: string | null;
    createdAt: Date;
    updatedAt: Date;
    featuredAt: Date | null;
    tags: Tag[];
}
