import { gql } from '@apollo/client';
import { GAME_FIELDS } from './fragments/game-fields';

export const LIST_GAMES = gql`
  ${GAME_FIELDS}
  query listGames(
    $limit: Int
    $offset: Int
    $criteria: GamesBoolExp
    $orderBy: [GamesOrderBy!]
  ) {
    payload: games(
      limit: $limit
      offset: $offset
      where: $criteria
      orderBy: $orderBy
    ) {
      ...GameFields
    }
  }
`;
