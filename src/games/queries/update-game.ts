import { gql } from '@apollo/client';
import { GAME_FIELDS } from './fragments/game-fields';

export const UPDATE_GAME = gql`
    ${GAME_FIELDS}
    mutation UpdateGame($id: uuid!, $input: GamesSetInput!) {
        payload: updateGamesByPk(pk_columns: { id: $id }, _set: $input) {
            ...GameFields
        }
    }
`;
