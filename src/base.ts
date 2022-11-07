import {
    ApolloClient,
    createHttpLink,
    DocumentNode,
    InMemoryCache,
    MutationOptions,
    OperationVariables,
    QueryOptions,
    NormalizedCacheObject,
} from '@apollo/client';
import axios, { AxiosInstance } from 'axios';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { setContext } from '@apollo/client/link/context';
import { SecurityChallenge } from './auth/interfaces';
import { GET_SECURITY_CHALLENGE } from './auth/queries';

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

export class EarnAllianceBaseClient {
    private readonly _client: ApolloClient<NormalizedCacheObject>;
    private readonly _uploadClient: AxiosInstance;
    private readonly _clientOptions: ClientOptions;
    private readonly _firebaseApp: FirebaseApp;
    private readonly _firebaseAuth: Auth;
    private readonly _firebaseStorage: FirebaseStorage;
    constructor(options: ClientOptions) {
        this._clientOptions = options;
        this._uploadClient = axios.create({
            baseURL: options.hasuraUploadApiUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        this._firebaseApp = initializeApp(JSON.parse(options.firebaseConfig || '{}'));
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

        this._uploadClient.interceptors.request.use(async (config: any) => {
            const idToken = await this.getAccessToken();
            config.headers!['Authorization'] = `Bearer ${idToken}`;
            return config;
        });
    }

    getCurrentUser() {
        return this.firebaseAuth.currentUser;
    }

    async getSecurityChallenge(address: string) {
        const resp = await this.query<{ payload: SecurityChallenge }>(GET_SECURITY_CHALLENGE, { address });
        return resp.data.payload.challenge;
    }

    async getAccessToken(forceRefresh: boolean = false): Promise<string | undefined> {
        return this.getCurrentUser()?.getIdToken(forceRefresh);
    }

    protected get client(): ApolloClient<NormalizedCacheObject> {
        return this._client;
    }
    protected get uploadClient(): AxiosInstance {
        return this._uploadClient;
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

    buildRoleContext(role?: string) {
        if (!role) return {};
        return { headers: { 'X-Hasura-Role': role } };
    }

    mutate<T>(gql: DocumentNode, variables?: OperationVariables, options?: RequestOptions) {
        const mutationOptions: MutationOptions = {
            mutation: gql,
            variables,
            context: this.buildRoleContext(options?.role),
        };

        return this.client.mutate<T>(mutationOptions);
    }

    query<T>(gql: DocumentNode, variables?: OperationVariables, options?: RequestOptions) {
        const queryOptions: QueryOptions = {
            query: gql,
            variables,
            context: this.buildRoleContext(options?.role),
            fetchPolicy: options?.forceRefresh ? 'no-cache' : undefined,
        };

        return this.client.query<T>(queryOptions);
    }
}
