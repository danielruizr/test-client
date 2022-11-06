(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@apollo/client'), require('@apollo/client/link/context'), require('ethers'), require('firebase/app'), require('firebase/auth'), require('firebase/storage'), require('@firebase/auth')) :
  typeof define === 'function' && define.amd ? define(['exports', '@apollo/client', '@apollo/client/link/context', 'ethers', 'firebase/app', 'firebase/auth', 'firebase/storage', '@firebase/auth'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.earnallianceClient = {}, global.client, global.context, null, global.app, global.auth, global.storage));
})(this, (function (exports, client, context, ethers, app, auth, storage) { 'use strict';

  const firebaseApp = app.initializeApp({}); // TODO add int
  const firebaseAuth = auth.getAuth(firebaseApp);
  storage.getStorage(firebaseApp);

  const httpLink = client.createHttpLink({
      uri: '', // TODO: Config
  });
  const authLink = context.setContext(async (_, { headers }) => {
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
  new client.ApolloClient({
      link: authLink.concat(httpLink),
      cache: new client.InMemoryCache(),
  });

  client.gql `
  query GetSecurityChallenge($address: String!) {
    payload: securityChallenge(address: $address) {
      challenge
    }
  }
`;

  client.gql `
  mutation SignUp($address: String!, $message: String!, $signature: String!) {
    payload: signUp(
      args: { address: $address, message: $message, signature: $signature }
    ) {
      token
    }
  }
`;

  client.gql `
  mutation SignIn($address: String!, $message: String!, $signature: String!) {
    payload: signIn(
      args: { address: $address, message: $message, signature: $signature }
    ) {
      token
    }
  }
`;

  client.gql `
  mutation ConnectDiscord($accessToken: String!) {
    payload: connectDiscord(args: { accessToken: $accessToken }) {
      id
      discordId
    }
  }
`;

  client.gql `
  mutation DisconnectDiscord($discordId: String!) {
    payload: disconnectDiscord(args: { discordId: $discordId }) {
      id
    }
  }
`;

  client.gql `
  mutation connectTwitter($idToken: String!, $accessToken: String!, $secret: String!) {
    connectTwitter(data: {idToken: $idToken, accessToken: $accessToken, secret: $secret}) {
      userId
    }
  }
`;
  client.gql `
  mutation disconnectTwitter {
    disconnectTwitter {
      userId
    }
  }
`;

  const getAccessToken = async (forceRefresh = false) => {
      return getCurrentUser()?.getIdToken(forceRefresh);
  };
  const getCurrentUser = () => firebaseAuth.currentUser;

  class EarnAllianceBaseClient {
      _client;
      _clientOptions;
      constructor(options) {
          this._clientOptions = options;
          const httpLink = client.createHttpLink({
              uri: options.uri,
          });
          const authLink = context.setContext(async (_, { headers }) => {
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
          this._client = new client.ApolloClient({
              link: authLink.concat(httpLink),
              cache: new client.InMemoryCache(),
          });
      }
      get client() {
          return this._client;
      }
      get clientOptions() {
          return this._clientOptions;
      }
      buildRoleContext(role) {
          if (!role)
              return {};
          return { headers: { 'X-Hasura-Role': role } };
      }
      ;
      mutate(gql, variables, options) {
          const mutationOptions = {
              mutation: gql,
              variables,
              context: this.buildRoleContext(options?.role),
          };
          return this.client.mutate(mutationOptions);
      }
      ;
      query(gql, variables, options) {
          const queryOptions = {
              query: gql,
              variables,
              context: this.buildRoleContext(options?.role),
              fetchPolicy: options?.forceRefresh ? 'no-cache' : undefined,
          };
          return this.client.query(queryOptions);
      }
      ;
  }

  const BLOCKCHAIN_FIELDS = client.gql `
  fragment BlockchainFields on Blockchains {
    id
    name
    description
  }
`;

  const CREATE_BLOCKCHAIN = client.gql `
  ${BLOCKCHAIN_FIELDS}
  mutation CreateBlockchain($input: BlockchainsInsertInput!) {
    payload: insertBlockchainsOne(object: $input) {
      ...BlockchainFields
    }
  }
`;

  const LIST_BLOCKCHAINS = client.gql `
  ${BLOCKCHAIN_FIELDS}
  query listBlockchains {
    payload: blockchains {
      ...BlockchainFields
    }
  }
`;

  class EarnAllianceBlockchainsClient extends EarnAllianceBaseClient {
      async listBlockchains(forceRefresh = false) {
          const { data } = await this.query(LIST_BLOCKCHAINS, undefined, {
              forceRefresh,
          });
          return data.payload;
      }
      ;
      async createBlockchain(blockchain) {
          const { data } = await this.mutate(CREATE_BLOCKCHAIN, {
              input: {
                  ...blockchain,
              },
          }, {
              role: 'editor',
          });
          return data?.payload;
      }
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  function applyMixins(derivedCtor, constructors) {
      constructors.forEach(baseCtor => {
          Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
              if (name === 'constructor') {
                  return;
              }
              Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
          });
      });
  }

  /* eslint-disable @typescript-eslint/no-empty-interface */
  class EarnAllianceClient extends EarnAllianceBaseClient {
  }
  applyMixins(EarnAllianceClient, [EarnAllianceBlockchainsClient]);

  exports.EarnAllianceClient = EarnAllianceClient;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
