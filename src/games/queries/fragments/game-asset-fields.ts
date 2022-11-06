import { gql } from '@apollo/client';

export const GAME_ASSET_FIELDS = gql`
  fragment GameAssetFields on GameAssets {
    id
    assetType
    assetKey
    assetValue
  }
`;
