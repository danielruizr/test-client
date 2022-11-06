import { Blockchain } from './interfaces';
import { EarnAllianceBaseClient } from '../base';
export declare class EarnAllianceBlockchainsClient extends EarnAllianceBaseClient {
    listBlockchains(forceRefresh?: boolean): Promise<Blockchain[]>;
    createBlockchain(blockchain: Partial<Blockchain>): Promise<Blockchain | undefined>;
}
