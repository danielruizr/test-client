import { gql } from '@apollo/client';

export const GET_NEWS_BY_SLUG = gql`
  query getNewsBySlug($slug: String!) {
    payload: news(where: {slug: {_eq: $slug}}) {
      body
      coverImg
      createdAt
      id
      metaExcerpt
      metaImg
      metaTitle
      featuredAt
      slug
      title
      updatedAt
      tags {
        tag
      }
      submission {
        authorAddress
      }
    }
  }

`;
