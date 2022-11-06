import { gql } from '@apollo/client';
import { BLOCKCHAIN_FIELDS } from './fragments/blockchain-fields';

export const LIST_BLOCKCHAINS = gql`
  ${BLOCKCHAIN_FIELDS}
  query listBlockchains {
    payload: blockchains {
      ...BlockchainFields
    }
  }
`;
