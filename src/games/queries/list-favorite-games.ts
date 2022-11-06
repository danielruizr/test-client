import { gql } from '@apollo/client';
import { GAME_FIELDS } from './fragments/game-fields';

export const LIST_FAVORITE_GAMES = gql`
  ${GAME_FIELDS}
  query listFavoriteGames($limit: Int, $offset: Int) {
    payload: userFavoriteGames(limit: $limit, offset: $offset) {
      game {
        ...GameFields
      }
    }
  }
`;
