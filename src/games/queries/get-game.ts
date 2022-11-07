import { gql } from '@apollo/client';
import { GAME_DETAIL_FIELDS } from './fragments/game-detail-fields';

export const GET_GAME = gql`
    ${GAME_DETAIL_FIELDS}
    query getGame($id: uuid!) {
        payload: gamesByPk(id: $id) {
            ...GameDetailFields
        }
    }
`;
