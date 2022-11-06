import * as hasuraService from '../hasura';
import { UserBanners } from './interfaces';
import { LIST_USER_BANNERS } from './queries/list-user-banners';

export const listUserBanners = async (forceRefresh: boolean = false) => {
  const { data } = await hasuraService.query<{ payload: UserBanners[] }>(
    LIST_USER_BANNERS,
    undefined,
    { forceRefresh }
  );

  return data?.payload;
};
