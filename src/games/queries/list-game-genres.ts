import { gql } from '@apollo/client';
import { GAME_GENRE_FIELDS } from './fragments/game-genre-fields';

export const LIST_GAME_GENRES = gql`
  ${GAME_GENRE_FIELDS}
  query listGameGenres {
    payload: gameGenres {
      ...GameGenreFields
    }
  }
`;
