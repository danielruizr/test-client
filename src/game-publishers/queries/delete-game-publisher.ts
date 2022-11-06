import { gql } from '@apollo/client';
import { GAME_PUBLISHER_FIELDS } from './fragments/game-publisher-fields';

export const DELETE_GAME_PUBLISHER = gql`
  ${GAME_PUBLISHER_FIELDS}
  mutation DeleteGamePublisher($id: uuid!) {
    payload: deleteGamePublishersByPk(id: $id) {
      ...GamePublisherFields
    }
  }
`;
