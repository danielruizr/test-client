import { gql } from '@apollo/client';

export const UPDATE_LAST_SEEN = gql`
  mutation updateLastSeen {
    payload: updateLastSeen {
      success
    }
  }
`;
