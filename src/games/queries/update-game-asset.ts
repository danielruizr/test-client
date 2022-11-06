import { gql } from '@apollo/client';
import { GAME_ASSET_FIELDS } from './fragments/game-asset-fields';

export const UPDATE_GAME_ASSET = gql`
  ${GAME_ASSET_FIELDS}
  mutation UpdateGameAsset($id: uuid!, $input: GameAssetsSetInput!) {
    payload: updateGameAssetsByPk(pk_columns: { id: $id }, _set: $input) {
      ...GameAssetFields
    }
  }
`;
