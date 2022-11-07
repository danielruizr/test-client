import { gql } from '@apollo/client';

export const LIST_ALL_NEWS_MIRROR_SUBMISSIONS_BY_USER_ID = gql`
    query listAllNewsMirrorSubmissionsByUserId($userId: uuid!) {
        payload: newsMirrorSubmissions(where: { author: { userId: { _eq: $userId } } }) {
            createdAt
            digest
            publishedAt
            newsId
            rejectedAt
            updatedAt
            submittedAt
            news {
                body
                coverImg
                createdAt
                id
                metaExcerpt
                metaTitle
                metaImg
                featuredAt
                title
                updatedAt
                tags {
                    newsId
                    tag
                    createdAt
                }
            }
        }
    }
`;
