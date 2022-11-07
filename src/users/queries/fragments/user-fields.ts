import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
    fragment UserFields on Users {
        bannerImgPath
        bio
        createdAt
        discordId
        id
        profilePicPath
        twitterId
        updatedAt
        username
        discord {
            username
            discriminator
        }
        discriminator
    }
`;
