import { ApolloClient, DocumentNode, OperationVariables, NormalizedCacheObject } from '@apollo/client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
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
    private readonly _firebaseApp;
    private readonly _firebaseAuth;
    private readonly _firebaseStorage;
    constructor(options: ClientOptions);
    getCurrentUser(): import("@firebase/auth").User | null;
    getAccessToken(forceRefresh?: boolean): Promise<string | undefined>;
    protected get client(): ApolloClient<NormalizedCacheObject>;
    protected get clientOptions(): ClientOptions;
    protected get firebaseApp(): FirebaseApp;
    protected get firebaseAuth(): Auth;
    protected get firebaseStorage(): FirebaseStorage;
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
