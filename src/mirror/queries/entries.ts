
import { gql } from '@apollo/client';
import {
  ENTRY_DETAIL,
  PUBLISHER_DETAILS,
  PROJECT_DETAILS,
  MEDIA_ASSET,
  MEDIA_ASSET_SIZES,
  MEDIA_ASSET_SIZE,
  THEME_DETAILS,
  MEMBER_DETAILS,
  ENTRY_EDITION,
  ENTRY_SETTINGS_DETAILS,
  ENTRY_BASICS,
} from './fragments';



export const GET_ENTRIES_DIGESTS_AND_PUBLISHER_BY_ADDRESS = gql`
query GetEntriesDigestsAndPublisherByAddress($projectAddress: String!) {
  mirror {
    entries(projectAddress: $projectAddress) {
      originalDigest
      publisher {
        project {
          address
        }
      }
    }
  }
}

`
export const GET_ENTRY_PUBLISHER_BY_DIGEST = gql`
query GetEntryPublisherByDigest($digest: String!) {
  mirror {
    entry(digest: $digest) {
      publisher {
        project {
          address
        }
      }
    }
  }
}

`
export const GET_ENTRIES = gql`
${ENTRY_BASICS}
query GetEntries($projectAddress: String!) {
  mirror {
    entries(projectAddress: $projectAddress) {
      ...entryBasics
      __typename
    }
  }
}
`
export const GET_ENTRY_BY_DIGEST = gql`
${ENTRY_BASICS}
query GetEntryByDigest($digest: String!) {
  mirror {
    entry(digest: $digest) {
      ...entryBasics
      __typename
    }
  }
}
`

export const GET_ENTRY_WITH_DETAILS = gql`
${ENTRY_DETAIL}
${PUBLISHER_DETAILS}
${PROJECT_DETAILS}
${MEDIA_ASSET}
${MEDIA_ASSET_SIZES}
${MEDIA_ASSET_SIZE}
${THEME_DETAILS}
${MEMBER_DETAILS}
${ENTRY_EDITION}
${ENTRY_SETTINGS_DETAILS}
query GetEntryWithDetails($digest: String!) {
  mirror {
    entry(digest: $digest) {
      ...entryDetails
      collaborators {
        ...memberDetails
        __typename
      }
      editions {
        ...entryEdition
        blockState {
          status
          __typename
        }
        __typename
      }
      publisher {
        ...publisherDetails
        __typename
      }
      settings {
        ...entrySettingsDetails
        __typename
      }
      writingNFT {
        _id
        __typename
      }
      __typename
    }
  }
}

`