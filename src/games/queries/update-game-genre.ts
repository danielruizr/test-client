import { gql } from '@apollo/client';
import { GAME_GENRE_FIELDS } from './fragments/game-genre-fields';

export const UPDATE_GAME_GENRE = gql`
    ${GAME_GENRE_FIELDS}
    mutation UpdateGameGenre($id: uuid!, $input: GameGenresSetInput!) {
        payload: updateGameGenresByPk(pk_columns: { id: $id }, _set: $input) {
            ...GameGenreFields
        }
    }
`;
