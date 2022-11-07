import { gql } from '@apollo/client';

export const SIGN_IN = gql`
    mutation SignIn($address: String!, $message: String!, $signature: String!) {
        payload: signIn(args: { address: $address, message: $message, signature: $signature }) {
            token
        }
    }
`;
