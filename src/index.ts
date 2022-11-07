/* eslint-disable @typescript-eslint/no-empty-interface */

import { EarnAllianceBaseClient } from './base';
import { EarnAllianceBlockchainsClient } from './blockchains';
import { EarnAllianceAuthClient } from './auth';
import { applyMixins } from './utilities/mixin';

export class EarnAllianceClient extends EarnAllianceBaseClient {}

export interface EarnAllianceClient extends EarnAllianceBlockchainsClient, EarnAllianceAuthClient {}

applyMixins(EarnAllianceClient, [EarnAllianceBlockchainsClient, EarnAllianceAuthClient]);
