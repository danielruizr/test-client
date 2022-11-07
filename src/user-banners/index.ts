import { EarnAllianceBaseClient } from 'src/base';
import { UserBanners } from './interfaces';
import { LIST_USER_BANNERS } from './queries/list-user-banners';

export class EarnAllianceUserBannersClient extends EarnAllianceBaseClient {
    async listUserBanners(forceRefresh: boolean = false) {
        const { data } = await this.query<{ payload: UserBanners[] }>(LIST_USER_BANNERS, undefined, { forceRefresh });

        return data?.payload;
    }
}
