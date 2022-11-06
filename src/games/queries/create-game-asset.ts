import { gql } from '@apollo/client';
import { GAME_ASSET_FIELDS } from './fragments/game-asset-fields';

export const CREATE_GAME_ASSET = gql`
  ${GAME_ASSET_FIELDS}
  mutation CreateGameAsset($input: GameAssetsInsertInput!) {
    payload: insertGameAssetsOne(object: $input) {
      ...GameAssetFields
    }
  }
`;
