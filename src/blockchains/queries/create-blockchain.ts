import { gql } from '@apollo/client';
import { BLOCKCHAIN_FIELDS } from './fragments/blockchain-fields';

export const CREATE_BLOCKCHAIN = gql`
    ${BLOCKCHAIN_FIELDS}
    mutation CreateBlockchain($input: BlockchainsInsertInput!) {
        payload: insertBlockchainsOne(object: $input) {
            ...BlockchainFields
        }
    }
`;
