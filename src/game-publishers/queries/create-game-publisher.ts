import { gql } from '@apollo/client';
import { GAME_PUBLISHER_FIELDS } from './fragments/game-publisher-fields';

export const CREATE_GAME_PUBLISHER = gql`
  ${GAME_PUBLISHER_FIELDS}
  mutation CreateGamePublisher($input: GamePublishersInsertInput!) {
    payload: insertGamePublishersOne(object: $input) {
      ...GamePublisherFields
    }
  }
`;
