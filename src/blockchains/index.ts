import * as hasuraService from '../hasura';
import { MutationOptions, QueryOptions } from '@apollo/client';
import { Blockchain } from './interfaces';
import { CREATE_BLOCKCHAIN } from './queries/create-blockchain';
import { LIST_BLOCKCHAINS } from './queries/list-blockchains';
import { EarnAllianceBaseClient } from '../base';



export class EarnAllianceBlockchainsClient extends EarnAllianceBaseClient {
  async listBlockchains (
    forceRefresh: boolean = false
  ): Promise<Blockchain[]> {
    const { data } = await this.query<{ payload: Blockchain[] }>(
      LIST_BLOCKCHAINS,
      undefined,
      {
        forceRefresh,
      }
    );
    return data.payload;
  };

  async createBlockchain (
    blockchain: Partial<Blockchain>
  ) {
    const { data } = await  this.mutate<{ payload: Blockchain }>(
      CREATE_BLOCKCHAIN,
      {
        input: {
          ...blockchain,
        },
      },
      {
        role: 'editor',
      },
    );

    return data?.payload;
  }
}
