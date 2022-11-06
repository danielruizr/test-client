import { gql } from '@apollo/client';

export const DELETE_GAME_GENRE = gql`
  mutation DeleteGameGenre($id: uuid!) {
    payload: deleteGameGenres(where: {game: {id: {_eq: $id}}}) {
      affected_rows
    }
  }
`;
