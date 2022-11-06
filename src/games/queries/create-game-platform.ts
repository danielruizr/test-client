import { gql } from '@apollo/client';
import { GAME_PLATFORM_FIELDS } from './fragments/game-platform-fields';

export const CREATE_GAME_PLATFORM = gql`
  ${GAME_PLATFORM_FIELDS}
  mutation CreateGamePlatform($input: [GamePlatformsInsertInput!]!) {
    payload: insertGamePlatforms(objects: $input) {
      affected_rows
    }
  }
`;
