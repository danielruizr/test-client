import { gql } from '@apollo/client';

export const DELETE_GAME = gql`
  mutation DeleteGame($id: uuid!) {
    deleteGamePlatforms(where: {game: {id: {_eq: $id}}}) {
      affected_rows
    }
    deleteGameGenres(where: {game: {id: {_eq: $id}}}) {
      affected_rows
    }
    deleteGameBlockchains(where: { gameId: { _eq: $id } }) {
      affected_rows
    }
    deleteGameAssets(
      where: { gameId: { _eq: $id } }
    ) {
      affected_rows
    }
    deleteGameMetadata(
      where: { gameId: { _eq: $id } }
    ) {
      affected_rows
    }
    payload: deleteGamesByPk(id: $id) {
      id
    }

  }
`;
