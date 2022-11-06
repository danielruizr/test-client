import { gql } from '@apollo/client';
import { GAME_PUBLISHER_FIELDS } from './fragments/game-publisher-fields';

export const UPDATE_GAME_PUBLISHER = gql`
  ${GAME_PUBLISHER_FIELDS}
  mutation UpdateGamePublisher($id: uuid!, $input: GamePublishersSetInput!) {
    payload: updateGamePublishersByPk(pk_columns: { id: $id }, _set: $input) {
      ...GamePublisherFields
    }
  }
`;
