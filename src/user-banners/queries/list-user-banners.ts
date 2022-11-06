import { gql } from '@apollo/client';
import { USER_BANNER_FIELDS } from './fragments/user-banner-fields';

export const LIST_USER_BANNERS = gql`
  ${USER_BANNER_FIELDS}
  query listUserBanners {
    payload: userBanners {
      ...UserBannerFields
    }
  }
`;
