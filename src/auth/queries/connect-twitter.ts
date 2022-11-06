import { gql } from '@apollo/client';

export const CONNECT_TWITTER = gql`
  mutation connectTwitter($idToken: String!, $accessToken: String!, $secret: String!) {
    connectTwitter(data: {idToken: $idToken, accessToken: $accessToken, secret: $secret}) {
      userId
    }
  }
`;
export const DISCONNECT_TWITTER = gql`
  mutation disconnectTwitter {
    disconnectTwitter {
      userId
    }
  }
`;
