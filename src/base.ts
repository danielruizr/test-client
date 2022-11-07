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
  import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage} from 'firebase/storage';
  import { setContext } from '@apollo/client/link/context';
  import { EarnAllianceAuthClient } from './auth';


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
    private readonly _firebaseApp: FirebaseApp;
    private readonly _firebaseAuth: Auth;
    private readonly _firebaseStorage: FirebaseStorage;
    constructor(options: ClientOptions) {
      this._clientOptions = options;
      this._firebaseApp = initializeApp(options.firebaseConfig);
      this._firebaseAuth = getAuth(this._firebaseApp);
      this._firebaseStorage = getStorage(this._firebaseApp);
        const httpLink = createHttpLink({
            uri: options.uri,
          });
          
          const authLink = setContext(async (_: any, { headers }: { headers: any }) => {
            const token = await this.getAccessToken();
          
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

    getCurrentUser() { return this.firebaseAuth.currentUser;}

    async getAccessToken(
      forceRefresh: boolean = false
    ): Promise<string | undefined>  {
      return this.getCurrentUser()?.getIdToken(forceRefresh);
    }


    protected get client(): ApolloClient<NormalizedCacheObject> {
        return this._client;
    }
    protected get clientOptions(): ClientOptions {
      return this._clientOptions;
    }

    protected get firebaseApp(): FirebaseApp {
      return this._firebaseApp;
    }

    protected get firebaseAuth(): Auth {
      return this._firebaseAuth;
    }

    protected get firebaseStorage(): FirebaseStorage {
      return this._firebaseStorage;
    }

    buildRoleContext (role?: string) {
      if (!role) return {};
      return { headers: { 'X-Hasura-Role': role } };
    }

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
    }
    
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
    }

}
