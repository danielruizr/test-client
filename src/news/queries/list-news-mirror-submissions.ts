import { gql } from '@apollo/client';

export const LIST_ALL_NEWS_MIRROR_SUBMISSIONS = gql`
    query listAllNewsMirrorSubmissions {
        payload: newsMirrorSubmissions {
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
