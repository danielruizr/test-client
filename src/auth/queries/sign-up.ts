import { gql } from '@apollo/client';

export const SIGN_UP = gql`
    mutation SignUp($address: String!, $message: String!, $signature: String!) {
        payload: signUp(args: { address: $address, message: $message, signature: $signature }) {
            token
        }
    }
`;
