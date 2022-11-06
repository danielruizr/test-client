/* eslint-disable @typescript-eslint/no-empty-interface */

import { EarnAllianceBaseClient } from './base';
import { EarnAllianceBlockchainsClient } from './blockchains';
import { applyMixins } from './utilities/mixin';

export class EarnAllianceClient extends EarnAllianceBaseClient {}

export interface EarnAllianceClient extends EarnAllianceBlockchainsClient {}

applyMixins(EarnAllianceClient, [ EarnAllianceBlockchainsClient ]);