import { gql } from '@apollo/client';

export const GET_SECURITY_CHALLENGE = gql`
    query GetSecurityChallenge($address: String!) {
        payload: securityChallenge(address: $address) {
            challenge
        }
    }
`;
