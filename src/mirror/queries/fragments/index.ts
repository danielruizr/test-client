import { gql } from '@apollo/client';
export const MEDIA_ASSET_SIZE = gql`
    fragment mediaAssetSize on MediaAssetSizeType {
        src
        height
        width
        __typename
    }
`;
export const MEDIA_ASSET_SIZES = gql`
    ${MEDIA_ASSET_SIZE}
    fragment mediaAssetSizes on MediaAssetSizesType {
        og {
            ...mediaAssetSize
            __typename
        }
        lg {
            ...mediaAssetSize
            __typename
        }
        md {
            ...mediaAssetSize
            __typename
        }
        sm {
            ...mediaAssetSize
            __typename
        }
        __typename
    }
`;
export const MEDIA_ASSET = gql`
    ${MEDIA_ASSET_SIZES}
    fragment mediaAsset on MediaAssetType {
        id
        cid
        mimetype
        sizes {
            ...mediaAssetSizes
            __typename
        }
        url
        __typename
    }
`;
export const ENTRY_SETTINGS_DETAILS = gql`
    ${MEDIA_ASSET}
    fragment entrySettingsDetails on EntrySettingsType {
        description
        metaImage {
            ...mediaAsset
            __typename
        }
        title
        __typename
    }
`;

export const ENTRY_BASICS = gql`
    ${ENTRY_SETTINGS_DETAILS}
    fragment entryBasics on entry {
        _id
        body
        hideTitleInEntry
        publishStatus
        publishedAtTimestamp
        originalDigest
        timestamp
        title
        featuredImageId
        featuredImage {
            mimetype
            url
            __typename
        }
        settings {
            ...entrySettingsDetails
        }
        userProfile {
            address
        }
        __typename
    }
`;

export const PUBLISHER_DETAILS = gql`
    fragment publisherDetails on PublisherType {
        project {
            ...projectDetails
            __typename
        }
        member {
            ...projectDetails
            __typename
        }
        __typename
    }
`;

export const PROJECT_DETAILS = gql`
    fragment projectDetails on ProjectType {
        _id
        address
        avatarURL
        description
        displayName
        domain
        ens
        gaTrackingID
        mailingListURL
        headerImage {
            ...mediaAsset
            __typename
        }
        theme {
            ...themeDetails
            __typename
        }
        __typename
    }
`;

export const THEME_DETAILS = gql`
    fragment themeDetails on UserProfileThemeType {
        accent
        colorMode
        __typename
    }
`;
export const MEMBER_DETAILS = gql`
    fragment memberDetails on ProjectType {
        _id
        address
        avatarURL
        displayName
        ens
        __typename
    }
`;
export const ENTRY_EDITION = gql`
    fragment entryEdition on edition {
        _id
        title
        price
        quantity
        description
        editionId
        mediaURL
        editionContractAddress
        fundingRecipient
        events {
            event
            transactionHash
            numSold
            avatarURL
            twitterUsername
            serialNumber
            collectorAddress
            amountPaid
            blockNumber
            __typename
        }
        attributes {
            trait_type
            value
            __typename
        }
        primaryMedia {
            mimetype
            sizes {
                og {
                    ...mediaAssetSize
                    __typename
                }
                __typename
            }
            __typename
        }
        thumbnailMedia {
            mimetype
            sizes {
                og {
                    ...mediaAssetSize
                    __typename
                }
                __typename
            }
            __typename
        }
        __typename
    }
`;

export const ENTRY_DETAIL = gql`
    ${ENTRY_BASICS}
    ${PUBLISHER_DETAILS}
    ${PROJECT_DETAILS}
    ${THEME_DETAILS}
    ${MEMBER_DETAILS}
    ${ENTRY_EDITION}

    fragment entryDetails on entry {
        ...entryBasics
        arweaveTransactionRequest {
            transactionId
            __typename
        }
        publisher {
            ...publisherDetails
            __typename
        }
        latestBlockData {
            timestamp
            number
            __typename
        }
        __typename
    }
`;
