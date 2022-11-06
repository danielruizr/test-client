import { ApolloClient, DocumentNode, OperationVariables, NormalizedCacheObject } from '@apollo/client';
interface RequestOptions {
    role?: 'editor';
    forceRefresh?: boolean;
}
interface ClientOptions {
    uri: string;
    firebaseConfig: any;
    hasuraUploadApiUrl: string;
    hasuraApiUrl: string;
    hasuraWsUrl: string;
    oauthConnectsUrl: string;
}
export declare class EarnAllianceBaseClient {
    private readonly _client;
    private readonly _clientOptions;
    constructor(options: ClientOptions);
    protected get client(): ApolloClient<NormalizedCacheObject>;
    protected get clientOptions(): ClientOptions;
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
