import { gql } from '@apollo/client';

export const LIST_PUBLISHED_NEWS = gql`
    query listPublishedNews {
        payload: news {
            slug
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
`;
