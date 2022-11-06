import { gql } from '@apollo/client';

export const DELETE_GAME_PLATFORM = gql`
  mutation DeleteGamePlatform($id: uuid!) {
    payload: deleteGamePlatforms(where: {game: {id: {_eq: $id}}}) {
      affected_rows
    }
  }
`;
