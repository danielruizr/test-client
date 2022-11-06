import { gql } from '@apollo/client';
import { USER_FIELDS } from './fragments/user-fields';
import { USER_WITH_WALLETS_FIELDS } from './fragments/user-with-wallets-fields';

export const GET_USER = gql`
  ${USER_FIELDS}
  query getUser($id: uuid!) {
    payload: usersByPk(id: $id) {
      ...UserFields
    }
  }
`;


export const GET_USER_WITH_WALLETS = gql`
  ${USER_WITH_WALLETS_FIELDS}
  query getUser($id: uuid!) {
    payload: usersByPk(id: $id) {
      ...UserWithWalletsFields
    }
  }
`