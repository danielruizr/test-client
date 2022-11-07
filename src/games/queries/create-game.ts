import { gql } from '@apollo/client';
import { GAME_FIELDS } from './fragments/game-fields';

export const CREATE_GAME = gql`
    ${GAME_FIELDS}
    mutation CreateGame($input: GamesInsertInput!) {
        payload: insertGamesOne(object: $input) {
            ...GameFields
        }
    }
`;
