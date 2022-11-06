import {
    ApolloClient,
    createHttpLink,
    DocumentNode,
    InMemoryCache,
    MutationOptions,
    OperationVariables,
    QueryOptions,
    NormalizedCacheObject
  } from '@apollo/client';
  import { setContext } from '@apollo/client/link/context';
  import { getAccessToken } from './auth';


interface RequestOptions {
  role?: 'editor';
  forceRefresh?: boolean;
}

interface ClientOptions {
  uri: string,
  firebaseConfig: any,
  hasuraUploadApiUrl: string,
  hasuraApiUrl: string,
  hasuraWsUrl: string,
  oauthConnectsUrl: string,
}

export class EarnAllianceBaseClient {
    private readonly _client: ApolloClient<NormalizedCacheObject>;
    private readonly _clientOptions : ClientOptions;
    constructor(options: ClientOptions) {
      this._clientOptions = options;
        const httpLink = createHttpLink({
            uri: options.uri,
          });
          
          const authLink = setContext(async (_: any, { headers }: { headers: any }) => {
            const token = await getAccessToken();
          
            if (!token) {
              return headers;
            }
          
            return {
              headers: {
                ...headers,
                authorization: `Bearer ${token}`,
              },
            };
          });
          
          this._client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
          });
    }

    protected get client(): ApolloClient<NormalizedCacheObject> {
        return this._client;
    }
    protected get clientOptions(): ClientOptions {
      return this._clientOptions;
  }

    buildRoleContext (role?: string) {
      if (!role) return {};
      return { headers: { 'X-Hasura-Role': role } };
    };

    mutate <T>(
      gql: DocumentNode,
      variables?: OperationVariables,
      options?: RequestOptions
    ) {
      const mutationOptions: MutationOptions = {
        mutation: gql,
        variables,
        context: this.buildRoleContext(options?.role),
      };
    
      return this.client.mutate<T>(mutationOptions);
    };
    
    query <T>(
      gql: DocumentNode,
      variables?: OperationVariables,
      options?: RequestOptions
    ) {
      const queryOptions: QueryOptions = {
        query: gql,
        variables,
        context: this.buildRoleContext(options?.role),
        fetchPolicy: options?.forceRefresh ? 'no-cache' : undefined,
      };
    
      return this.client.query<T>(queryOptions);
    };

}
