import { gql } from '@apollo/client';
import { GAME_ASSET_FIELDS } from './fragments/game-asset-fields';

export const LIST_GAME_ASSETS = gql`
    ${GAME_ASSET_FIELDS}
    query ListGameAsset($gameId: uuid!) {
        payload: gameAssets(where: { gameId: { _eq: $gameId } }) {
            ...GameAssetFields
        }
    }
`;
