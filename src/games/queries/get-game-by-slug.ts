import { gql } from '@apollo/client';
import { GAME_DETAIL_FIELDS } from './fragments/game-detail-fields';

export const GET_GAME_BY_SLUG = gql`
  ${GAME_DETAIL_FIELDS}
  query getGameBySlug($slug: String!) {
    payload: games(where: { slug: { _eq: $slug } }, limit: 1) {
      ...GameDetailFields
    }
  }
`;
