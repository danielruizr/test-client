import { gql } from '@apollo/client';
import { USER_WITH_WALLETS_FIELDS } from './fragments/user-with-wallets-fields';

export const CONNECT_WALLET = gql`
  ${USER_WITH_WALLETS_FIELDS}
  mutation connectWallet($address: String!, $message: String!, $signature: String!) {
    payload: connectWallet(
      args: { address: $address, message: $message, signature: $signature }
    ) {
      address, userId
    }
  }
`;
