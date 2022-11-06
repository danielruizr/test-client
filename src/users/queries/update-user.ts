import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation updateUser($data: UpdateUserInput!) {
    payload: updateUser(data: $data) {
      id,
      twitterId,
      discordId,
      bannerImgPath,
      profilePicPath,
      bio,
      discriminator,
      createdAt,
      updatedAt
    }
  }
`;
