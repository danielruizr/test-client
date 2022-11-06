import { DocumentNode, OperationVariables } from '@apollo/client';
interface RequestOptions {
    role?: 'editor';
    forceRefresh?: boolean;
}
export declare const mutate: <T>(gql: DocumentNode, variables?: OperationVariables, options?: RequestOptions) => Promise<import("@apollo/client").FetchResult<T, Record<string, any>, Record<string, any>>>;
export declare const query: <T>(gql: DocumentNode, variables?: OperationVariables, options?: RequestOptions) => Promise<import("@apollo/client").ApolloQueryResult<T>>;
export {};
