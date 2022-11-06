import { gql } from '@apollo/client';

export const DELETE_GAME_BLOCKCHAINS = gql`
  mutation DeleteGameBlockchains($gameId: uuid!) {
    payload: deleteGameBlockchains(where: { gameId: { _eq: $gameId } }) {
      affected_rows
    }
  }
`;
