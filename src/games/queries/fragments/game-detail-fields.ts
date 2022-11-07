import { gql } from '@apollo/client';
import { GAME_ASSET_FIELDS } from './game-asset-fields';
import { GAME_FIELDS } from './game-fields';
import { GAME_GENRE_FIELDS } from './game-genre-fields';
import { GAME_METADATA_FIELDS } from './game-metadata-fields';
import { GAME_PLATFORM_FIELDS } from './game-platform-fields';

export const GAME_DETAIL_FIELDS = gql`
    ${GAME_PLATFORM_FIELDS}
    ${GAME_GENRE_FIELDS}
    ${GAME_ASSET_FIELDS}
    ${GAME_METADATA_FIELDS}
    ${GAME_FIELDS}
    fragment GameDetailFields on Games {
        ...GameFields
        metadata: metadata {
            ...GameMetadataFields
        }
        trailers: assets(where: { assetKey: { _eq: "TRAILER" } }) {
            ...GameAssetFields
        }
        snapshots: assets(where: { assetKey: { _eq: "SNAPSHOT" } }) {
            ...GameAssetFields
        }
        genres {
            ...GameGenreFields
        }
        platforms {
            ...GamePlatformFields
        }
    }
`;
