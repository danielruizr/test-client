import { gql } from '@apollo/client';

export const DELETE_GAME_ASSET = gql`
    mutation DeleteGameAsset($gameId: uuid!, $id: uuid!) {
        payload: deleteGameAssets(where: { gameId: { _eq: $gameId }, id: { _eq: $id } }) {
            affected_rows
        }
    }
`;
