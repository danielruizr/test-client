import { News, NewsMirrorSubmission, WithNews } from './interfaces';
import { Tag } from './interfaces/tag';
export declare const publishNews: (news: Pick<News, 'title' | 'body' | 'coverImg' | 'metaTitle' | 'metaExcerpt' | 'metaImg' | 'featuredAt' | 'slug' | 'featuredAt'> & {
    tags: {
        data: Tag[];
    };
}, authorAddress: string, digest: string, userId: string) => Promise<NewsMirrorSubmission | undefined>;
export declare const rejectNews: (digest: string, userId: string) => Promise<NewsMirrorSubmission | undefined>;
export declare const insertNewsMirrorSubmission: (input: Pick<NewsMirrorSubmission, 'digest' | 'authorAddress'>[], role?: "editor" | undefined) => Promise<{
    id: string;
}[] | undefined>;
export declare const getNewsBySlug: (slug: string, forceRefresh?: boolean) => Promise<News & {
    submission: Pick<NewsMirrorSubmission, 'authorAddress'>;
}>;
export declare const getNewsMirrorSubmission: (digest: string, forceRefresh?: boolean) => Promise<NewsMirrorSubmission & WithNews>;
export declare const listNewsMirrorSubmission: (forceRefresh?: boolean) => Promise<(NewsMirrorSubmission & WithNews)[]>;
export declare const listNewsMirrorSubmissionByUser: (userId: string, forceRefresh?: boolean) => Promise<(NewsMirrorSubmission & WithNews)[]>;
export declare const listPublishedNews: (forceRefresh?: boolean) => Promise<News[]>;
