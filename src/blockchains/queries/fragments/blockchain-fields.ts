import { gql } from '@apollo/client';

export const BLOCKCHAIN_FIELDS = gql`
  fragment BlockchainFields on Blockchains {
    id
    name
    description
  }
`;
