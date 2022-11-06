import { gql } from '@apollo/client';

export const GAME_PUBLISHER_FIELDS = gql`
  fragment GamePublisherFields on GamePublishers {
    id
    name
  }
`;
