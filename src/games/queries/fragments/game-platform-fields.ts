import { gql } from '@apollo/client';

export const GAME_PLATFORM_FIELDS = gql`
  fragment GamePlatformFields on GamePlatforms {
    platform
  }
`;
