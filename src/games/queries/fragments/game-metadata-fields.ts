import { gql } from '@apollo/client';

export const GAME_METADATA_FIELDS = gql`
    fragment GameMetadataFields on GameMetadata {
        id
        metaType
        metaKey
        metaValue
    }
`;
