import { gql } from '@apollo/client';

export const PUBLISH_NEWS = gql`
    mutation publishNews($news: NewsInsertInput!, $authorAddress: citext!, $digest: String!, $publishedAt: timestamptz, $publishedBy: uuid) {
        deleteNewsTags(where: { news: { submission: { digest: { _eq: $digest } } } }) {
            affected_rows
        }
        deleteNews(where: { submission: { digest: { _eq: $digest } } }) {
            affected_rows
        }
        payload: insertNewsMirrorSubmissionsOne(
            object: {
                news: { data: $news }
                authorAddress: $authorAddress
                digest: $digest
                publishedAt: $publishedAt
                publishedBy: $publishedBy
                rejectedAt: null
                rejectedBy: null
                submittedAt: null
                submittedBy: null
            }
            onConflict: {
                constraint: news_mirror_submission_pkey
                update_columns: [rejectedAt, rejectedBy, publishedBy, publishedAt, submittedAt, submittedBy, newsId]
            }
        ) {
            rejectedAt
            rejectedBy
            updatedAt
            publishedBy
            publishedAt
            submittedAt
            submittedBy
            digest
            createdAt
            authorAddress
            news {
                body
                coverImg
                createdAt
                id
                metaExcerpt
                metaImg
                metaTitle
                featuredAt
                slug
                tags {
                    newsId
                    tag
                    createdAt
                }
                title
                updatedAt
            }
        }
    }
`;
