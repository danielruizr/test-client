import { gql } from '@apollo/client';

export const INSERT_NEWS_MIRROR_SUBMISSIONS = gql`
    mutation insertNewsMirrorSubmissions($input: [NewsMirrorSubmissionsInsertInput!]!) {
        payload: insertNewsMirrorSubmissions(objects: $input) {
            returning {
                digest
            }
        }
    }
`;
