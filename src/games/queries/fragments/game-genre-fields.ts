import { gql } from '@apollo/client';

export const GAME_GENRE_FIELDS = gql`
    fragment GameGenreFields on GameGenres {
        genre
    }
`;
