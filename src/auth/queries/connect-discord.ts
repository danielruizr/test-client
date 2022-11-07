import { gql } from '@apollo/client';

export const CONNECT_DISCORD = gql`
    mutation ConnectDiscord($accessToken: String!) {
        payload: connectDiscord(args: { accessToken: $accessToken }) {
            id
            discordId
        }
    }
`;
