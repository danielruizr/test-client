import { gql } from '@apollo/client';
import { GAME_GENRE_FIELDS } from './fragments/game-genre-fields';

export const CREATE_GAME_GENRE = gql`
  ${GAME_GENRE_FIELDS}
  mutation CreateGameGenre($input: [GameGenresInsertInput!]!) {
    payload: insertGameGenres(objects: $input) {
      affected_rows
    }
  }
`;
