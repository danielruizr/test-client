import { gql } from '@apollo/client';
import { GAME_ASSET_FIELDS } from './game-asset-fields';

export const GAME_FIELDS = gql`
    ${GAME_ASSET_FIELDS}
    fragment GameFields on Games {
        id
        name
        intro
        description
        publisherId
        blockchains {
            blockchain {
                id
                name
            }
        }
        releasedAt
        listedAt
        featuredAt
        slug
        thumbnails: assets(where: { assetKey: { _eq: "THUMBNAIL" } }) {
            ...GameAssetFields
        }
    }
`;
