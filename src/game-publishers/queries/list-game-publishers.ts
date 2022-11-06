import { gql } from '@apollo/client';
import { GAME_PUBLISHER_FIELDS } from './fragments/game-publisher-fields';

export const LIST_GAME_PUBLISHERS = gql`
  ${GAME_PUBLISHER_FIELDS}
  query listGamePublishers {
    payload: gamePublishers {
      ...GamePublisherFields
    }
  }
`;
