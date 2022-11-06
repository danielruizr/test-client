import { gql } from '@apollo/client';

export const GET_NEWS_MIRROR_SUBMISSIONS = gql`
  query getNewsMirrorSubmissions($digest: String!) {
    payload: newsMirrorSubmissionsByPk(digest: $digest) {
      createdAt
      digest
      authorAddress
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
