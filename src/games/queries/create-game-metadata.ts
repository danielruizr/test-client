import { gql } from '@apollo/client';
import { GAME_METADATA_FIELDS } from './fragments/game-metadata-fields';

export const CREATE_GAME_METADATA = gql`
  ${GAME_METADATA_FIELDS}
  mutation CreateGameMetadata($input: GameMetadataInsertInput!) {
    payload: insertGameMetadataOne(
      object: $input,
      onConflict: {
        constraint: game_metadata_game_id_asset_key_key,
        update_columns: [metaType, metaValue]
      }
    ) {
      ...GameMetadataFields
    }
  }
`;
