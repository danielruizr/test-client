'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var client = require('@apollo/client');
var app = require('firebase/app');
var auth = require('firebase/auth');
var storage = require('firebase/storage');
var context = require('@apollo/client/link/context');
var ethers = require('ethers');
var auth$1 = require('@firebase/auth');

class EarnAllianceBaseClient {
    _client;
    _clientOptions;
    _firebaseApp;
    _firebaseAuth;
    _firebaseStorage;
    constructor(options) {
        this._clientOptions = options;
        this._firebaseApp = app.initializeApp(options.firebaseConfig);
        this._firebaseAuth = auth.getAuth(this._firebaseApp);
        this._firebaseStorage = storage.getStorage(this._firebaseApp);
        const httpLink = client.createHttpLink({
            uri: options.uri,
        });
        const authLink = context.setContext(async (_, { headers }) => {
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
        this._client = new client.ApolloClient({
            link: authLink.concat(httpLink),
            cache: new client.InMemoryCache(),
        });
    }
    getCurrentUser() { return this.firebaseAuth.currentUser; }
    async getAccessToken(forceRefresh = false) {
        return this.getCurrentUser()?.getIdToken(forceRefresh);
    }
    get client() {
        return this._client;
    }
    get clientOptions() {
        return this._clientOptions;
    }
    get firebaseApp() {
        return this._firebaseApp;
    }
    get firebaseAuth() {
        return this._firebaseAuth;
    }
    get firebaseStorage() {
        return this._firebaseStorage;
    }
    buildRoleContext(role) {
        if (!role)
            return {};
        return { headers: { 'X-Hasura-Role': role } };
    }
    mutate(gql, variables, options) {
        const mutationOptions = {
            mutation: gql,
            variables,
            context: this.buildRoleContext(options?.role),
        };
        return this.client.mutate(mutationOptions);
    }
    query(gql, variables, options) {
        const queryOptions = {
            query: gql,
            variables,
            context: this.buildRoleContext(options?.role),
            fetchPolicy: options?.forceRefresh ? 'no-cache' : undefined,
        };
        return this.client.query(queryOptions);
    }
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

class NoMetamaskInstallationError extends Error {
    constructor(message) {
        super(message);
    }
}

class MetamaskNotConnectedError extends Error {
    constructor(message) {
        super(message);
    }
}

const isInstalled = () => window.ethereum?.isMetaMask;
const isConnected = () => window.ethereum?.isConnected();
const _validateMetamaskStatus = () => {
    if (!isInstalled() || !window.ethereum?.isMetaMask) {
        throw new NoMetamaskInstallationError();
    }
    if (!isConnected()) {
        throw new MetamaskNotConnectedError();
    }
};
const signMessage = async (message) => {
    _validateMetamaskStatus();
    const provider = new ethers.ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const [signature, signerAddress] = await Promise.all([
        signer.signMessage(message),
        signer.getAddress(),
    ]);
    return {
        message,
        signature,
        signerAddress,
    };
};

class InvalidSignerError extends Error {
    constructor(message) {
        super(message);
    }
}

const GET_SECURITY_CHALLENGE = client.gql `
  query GetSecurityChallenge($address: String!) {
    payload: securityChallenge(address: $address) {
      challenge
    }
  }
`;

const SIGN_UP = client.gql `
  mutation SignUp($address: String!, $message: String!, $signature: String!) {
    payload: signUp(
      args: { address: $address, message: $message, signature: $signature }
    ) {
      token
    }
  }
`;

const SIGN_IN = client.gql `
  mutation SignIn($address: String!, $message: String!, $signature: String!) {
    payload: signIn(
      args: { address: $address, message: $message, signature: $signature }
    ) {
      token
    }
  }
`;

const CONNECT_DISCORD = client.gql `
  mutation ConnectDiscord($accessToken: String!) {
    payload: connectDiscord(args: { accessToken: $accessToken }) {
      id
      discordId
    }
  }
`;

const DISCONNECT_DISCORD = client.gql `
  mutation DisconnectDiscord($discordId: String!) {
    payload: disconnectDiscord(args: { discordId: $discordId }) {
      id
    }
  }
`;

const CONNECT_TWITTER = client.gql `
  mutation connectTwitter($idToken: String!, $accessToken: String!, $secret: String!) {
    connectTwitter(data: {idToken: $idToken, accessToken: $accessToken, secret: $secret}) {
      userId
    }
  }
`;
const DISCONNECT_TWITTER = client.gql `
  mutation disconnectTwitter {
    disconnectTwitter {
      userId
    }
  }
`;

class EarnAllianceAuthClient extends EarnAllianceBaseClient {
    async getSecurityChallenge(address) {
        const resp = await this.query(GET_SECURITY_CHALLENGE, { address });
        return resp.data.payload.challenge;
    }
    hasInit = false;
    async initialize() {
        if (this.hasInit) {
            return;
        }
        this.hasInit = true;
        // metamask.onAccountChange(()  signOut());
    }
    getDiscordAccessToken() {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        return fragment.get('discord_access_token');
    }
    clearDiscordAccessToken() {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        fragment.delete('discord_access_token');
        window.location.hash = '#' + fragment.toString();
    }
    async signUp(address) {
        address = address.toLowerCase();
        const message = await this.getSecurityChallenge(address);
        const { signature, signerAddress } = await signMessage(message);
        if (address !== signerAddress.toLowerCase()) {
            throw new InvalidSignerError();
        }
        const resp = await this.mutate(SIGN_UP, {
            address,
            message,
            signature,
        });
        if (resp.errors) {
            throw resp.errors;
        }
        return auth$1.signInWithCustomToken(this.firebaseAuth, resp.data.payload.token);
    }
    async signIn(address) {
        address = address.toLowerCase();
        const message = await this.getSecurityChallenge(address);
        const { signature, signerAddress } = await signMessage(message);
        if (address !== signerAddress.toLowerCase()) {
            throw new InvalidSignerError();
        }
        const resp = await this.mutate(SIGN_IN, {
            address,
            message,
            signature,
        });
        if (resp.errors) {
            throw resp.errors;
        }
        return auth$1.signInWithCustomToken(this.firebaseAuth, resp.data.payload.token);
    }
    async signOut() {
        await this.firebaseAuth.signOut();
    }
    async authorizeDiscord(returnTo) {
        const url = new URL(`/discord/authorize`); // ** ADD URL
        url.searchParams.append('return_to', returnTo);
        window.location.href = url.toString();
    }
    async connectDiscord() {
        const accessToken = this.getDiscordAccessToken();
        this.clearDiscordAccessToken();
        if (!accessToken || !this.getCurrentUser()) {
            return;
        }
        // hasura bind discord
        const resp = await this.mutate(CONNECT_DISCORD, {
            accessToken,
        });
        if (resp.errors) {
            throw resp.errors;
        }
    }
    async disconnectDiscord(discordId) {
        // hasura bind discord
        const resp = await this.mutate(DISCONNECT_DISCORD, {
            discordId,
        });
        if (resp.errors) {
            throw resp.errors;
        }
    }
    async connectTwitter() {
        const auth$1 = auth.getAuth();
        const provider = new auth.TwitterAuthProvider();
        const result = await auth.linkWithPopup(auth$1.currentUser, provider);
        const credential = auth.TwitterAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const secret = credential?.secret;
        const idToken = await result.user.getIdToken();
        await this.mutate(CONNECT_TWITTER, {
            idToken,
            accessToken,
            secret,
        });
    }
    onAuthStateChanged(callback) {
        this.firebaseAuth.onAuthStateChanged(callback);
    }
    async disconnectTwitter() {
        const auth$1 = auth.getAuth();
        const provider = new auth.TwitterAuthProvider();
        const user = auth$1.currentUser;
        await auth.unlink(user, provider.providerId);
        await this.mutate(DISCONNECT_TWITTER);
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
applyMixins(EarnAllianceClient, [EarnAllianceBlockchainsClient, EarnAllianceAuthClient]);

exports.EarnAllianceClient = EarnAllianceClient;
