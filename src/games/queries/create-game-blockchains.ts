import { gql } from '@apollo/client';

export const CREATE_GAME_BLOCKCHAINS = gql`
  mutation CreateGameBlockchains($input: [GameBlockchainsInsertInput!]!) {
    payload: insertGameBlockchains(objects: $input) {
      affected_rows
    }
  }
`;
