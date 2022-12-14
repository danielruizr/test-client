import {
    LIST_ALL_NEWS_MIRROR_SUBMISSIONS,
    INSERT_NEWS_MIRROR_SUBMISSIONS,
    PUBLISH_NEWS,
    GET_NEWS_MIRROR_SUBMISSIONS,
    GET_NEWS_BY_SLUG,
} from './queries';
import { News, NewsMirrorSubmission, WithNews } from './interfaces';
import { LIST_PUBLISHED_NEWS } from './queries/list-published-news';
import { Tag } from './interfaces/tag';
import { REJECT_NEWS } from './queries/reject-news';
import { LIST_ALL_NEWS_MIRROR_SUBMISSIONS_BY_USER_ID } from './queries/list-news-mirror-submissions-by-userid';
import { EarnAllianceBaseClient } from 'src/base';

export class EarnAllianceNewsClient extends EarnAllianceBaseClient {
    async publishNews(
        news: Pick<News, 'title' | 'body' | 'coverImg' | 'metaTitle' | 'metaExcerpt' | 'metaImg' | 'featuredAt' | 'slug' | 'featuredAt'> & {
            tags: { data: Tag[] };
        },
        authorAddress: string,
        digest: string,
        userId: string
    ) {
        const { data } = await this.mutate<{
            payload: NewsMirrorSubmission;
        }>(
            PUBLISH_NEWS,
            {
                news,
                authorAddress,
                digest,
                publishedBy: userId,
                publishedAt: new Date(),
            },
            { role: 'editor' }
        );
        return data?.payload;
    }
    async rejectNews(digest: string, userId: string) {
        const { data } = await this.mutate<{
            payload: { returning: NewsMirrorSubmission };
        }>(
            REJECT_NEWS,
            {
                digest,
                rejectedBy: userId,
                rejectedAt: new Date(),
            },
            { role: 'editor' }
        );
        return data?.payload.returning;
    }
    async insertNewsMirrorSubmission(input: Pick<NewsMirrorSubmission, 'digest' | 'authorAddress'>[], role?: 'editor' | undefined) {
        const { data } = await this.mutate<{
            payload: { returning: { id: string }[] };
        }>(INSERT_NEWS_MIRROR_SUBMISSIONS, { input }, { role });
        return data?.payload.returning;
    }

    async getNewsBySlug(slug: string, forceRefresh = false) {
        const { data } = await this.query<{
            payload: (News & { submission: Pick<NewsMirrorSubmission, 'authorAddress'> })[];
        }>(GET_NEWS_BY_SLUG, { slug }, { forceRefresh });
        return data?.payload[0];
    }
    async getNewsMirrorSubmission(digest: string, forceRefresh = false) {
        const { data } = await this.query<{
            payload: NewsMirrorSubmission & WithNews;
        }>(GET_NEWS_MIRROR_SUBMISSIONS, { digest }, { forceRefresh });
        return data?.payload;
    }

    async listNewsMirrorSubmission(forceRefresh = false) {
        const { data } = await this.query<{
            payload: (NewsMirrorSubmission & WithNews)[];
        }>(LIST_ALL_NEWS_MIRROR_SUBMISSIONS, undefined, { forceRefresh });
        return data?.payload;
    }
    async listNewsMirrorSubmissionByUser(userId: string, forceRefresh = false) {
        const { data } = await this.query<{
            payload: (NewsMirrorSubmission & WithNews)[];
        }>(LIST_ALL_NEWS_MIRROR_SUBMISSIONS_BY_USER_ID, { userId }, { forceRefresh });
        return data?.payload;
    }

    async listPublishedNews(forceRefresh = false) {
        const { data } = await this.query<{
            payload: News[];
        }>(LIST_PUBLISHED_NEWS, undefined, { forceRefresh });
        return data?.payload;
    }
}
