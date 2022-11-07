import { News } from './news';

export interface NewsMirrorSubmission {
    digest: string;
    authorAddress: string;
    publishedAt?: Date;
    newsId?: string;
    rejectedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    submittedAt?: Date;
    submittedBy?: string;
    rejectedBy?: string;
    publishedBy?: string;
    news?: News;
}

export interface WithNews {
    news: News;
}
