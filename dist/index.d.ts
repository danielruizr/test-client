import { EarnAllianceBaseClient } from './base';
import { EarnAllianceBlockchainsClient } from './blockchains';
import { EarnAllianceAuthClient } from './auth';
export declare class EarnAllianceClient extends EarnAllianceBaseClient {
}
export interface EarnAllianceClient extends EarnAllianceBlockchainsClient, EarnAllianceAuthClient {
}
