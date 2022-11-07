import { gql } from '@apollo/client';

export const REJECT_NEWS = gql`
    mutation rejectNews($digest: String!, $rejectedAt: timestamptz, $rejectedBy: uuid) {
        deleteNewsTags(where: { news: { submission: { digest: { _eq: $digest } } } }) {
            affected_rows
        }
        deleteNews(where: { submission: { digest: { _eq: $digest } } }) {
            affected_rows
        }
        payload: updateNewsMirrorSubmissionsByPk(
            pk_columns: { digest: $digest }
            _set: { publishedAt: null, publishedBy: null, rejectedAt: $rejectedAt, rejectedBy: $rejectedBy, newsId: null }
        ) {
            rejectedAt
            rejectedBy
            updatedAt
            publishedBy
            publishedAt
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
