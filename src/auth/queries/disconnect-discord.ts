import { gql } from '@apollo/client';

export const DISCONNECT_DISCORD = gql`
    mutation DisconnectDiscord($discordId: String!) {
        payload: disconnectDiscord(args: { discordId: $discordId }) {
            id
        }
    }
`;
