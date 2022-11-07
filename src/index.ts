/* eslint-disable @typescript-eslint/no-empty-interface */

import { EarnAllianceBaseClient } from './base';
import { EarnAllianceBlockchainsClient } from './blockchains';
import { EarnAllianceUploadClient } from './upload';
import { EarnAllianceMetaMaskClient } from './metamask';
import { EarnAllianceGamePublishers } from './game-publishers';
import { EarnAllianceGamesClient } from './games';
import { EarnAllianceNewsClient } from './news';
import { EarnAllianceMirrorClient } from './mirror';
import { EarnAllianceAuthClient } from './auth';
import { EarnAllianceUserBannersClient } from './user-banners';
import { EarnAllianceUserClient } from './users';
import { applyMixins } from './utilities/mixin';

export class EarnAllianceClient extends EarnAllianceBaseClient {}

export interface EarnAllianceClient
    extends EarnAllianceBlockchainsClient,
        EarnAllianceAuthClient,
        EarnAllianceUploadClient,
        EarnAllianceGamesClient,
        EarnAllianceGamePublishers,
        EarnAllianceMirrorClient,
        EarnAllianceNewsClient,
        EarnAllianceUserBannersClient,
        EarnAllianceUserClient,
        EarnAllianceMetaMaskClient {}

applyMixins(EarnAllianceClient, [
    EarnAllianceBlockchainsClient,
    EarnAllianceAuthClient,
    EarnAllianceUploadClient,
    EarnAllianceGamesClient,
    EarnAllianceGamePublishers,
    EarnAllianceMirrorClient,
    EarnAllianceNewsClient,
    EarnAllianceUserBannersClient,
    EarnAllianceUserClient,
    EarnAllianceMetaMaskClient,
]);
