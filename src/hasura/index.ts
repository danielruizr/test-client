import {
  ApolloClient,
  createHttpLink,
  DocumentNode,
  InMemoryCache,
  MutationOptions,
  OperationVariables,
  QueryOptions,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from '../auth';
import { LIST_GAMES } from '../games/queries/list-games';

const httpLink = createHttpLink({
  uri: '', // TODO: Config
});

const authLink = setContext(async (_, { headers }) => {
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

interface RequestOptions {
  role?: 'editor';
  forceRefresh?: boolean;
}

const buildRoleContext = (role?: string) => {
  if (!role) return {};
  return { headers: { 'X-Hasura-Role': role } };
};

export const mutate = async <T>(
  gql: DocumentNode,
  variables?: OperationVariables,
  options?: RequestOptions
) => {
  const mutationOptions: MutationOptions = {
    mutation: gql,
    variables,
    context: buildRoleContext(options?.role),
  };

  return client.mutate<T>(mutationOptions);
};

export const query = async <T>(
  gql: DocumentNode,
  variables?: OperationVariables,
  options?: RequestOptions
) => {
  const queryOptions: QueryOptions = {
    query: gql,
    variables,
    context: buildRoleContext(options?.role),
    fetchPolicy: options?.forceRefresh ? 'no-cache' : undefined,
  };

  return client.query<T>(queryOptions);
};
