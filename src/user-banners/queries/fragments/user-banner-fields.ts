import { gql } from '@apollo/client';

export const USER_BANNER_FIELDS = gql`
    fragment UserBannerFields on UserBanners {
        id
        path
        isDefault
    }
`;
