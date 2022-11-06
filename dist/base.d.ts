import { ApolloClient, DocumentNode, OperationVariables, NormalizedCacheObject } from '@apollo/client';
interface RequestOptions {
    role?: 'editor';
    forceRefresh?: boolean;
}
export declare class EarnAllianceBaseClient {
    private readonly _client;
    constructor(uri: string);
    protected get client(): ApolloClient<NormalizedCacheObject>;
    buildRoleContext(role?: string): {
        headers?: undefined;
    } | {
        headers: {
            'X-Hasura-Role': string;
        };
    };
    mutate<T>(gql: DocumentNode, variables?: OperationVariables, options?: RequestOptions): Promise<import("@apollo/client").FetchResult<T, Record<string, any>, Record<string, any>>>;
    query<T>(gql: DocumentNode, variables?: OperationVariables, options?: RequestOptions): Promise<import("@apollo/client").ApolloQueryResult<T>>;
}
export {};
