import { gql } from '@apollo/client';
import { USER_FIELDS } from './user-fields';

export const USER_WITH_WALLETS_FIELDS = gql`
  ${USER_FIELDS}
  fragment UserWithWalletsFields on Users {
    ...UserFields
    wallets {
      userId
      address
      createdAt
      updatedAt
    }
  }
`;
