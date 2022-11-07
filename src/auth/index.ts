import * as metamask from '../metamask';
import { InvalidSignerError } from './errors/invalid-signer.error';
import { NextOrObserver, signInWithCustomToken, User } from '@firebase/auth';
import { GET_SECURITY_CHALLENGE, SIGN_UP, SIGN_IN, CONNECT_DISCORD, CONNECT_TWITTER, DISCONNECT_DISCORD, DISCONNECT_TWITTER } from './queries';
import { DisconnectDiscordOutput, DisconnectTwitterResponse, SecurityChallenge, SignInToken } from './interfaces';
import { ConnectDiscordOutput, ConnectTwitterResponse } from './interfaces';
import { getAuth, linkWithPopup, TwitterAuthProvider, unlink } from 'firebase/auth';
import { EarnAllianceBaseClient } from '../base';

export class EarnAllianceAuthClient extends EarnAllianceBaseClient {
    async getSecurityChallenge(address: string) {
        const resp = await this.query<{ payload: SecurityChallenge }>(GET_SECURITY_CHALLENGE, { address });
        return resp.data.payload.challenge;
    }

    public hasInit = false;
    async initialize() {
        if (this.hasInit) {
            return;
        }

        this.hasInit = true;

        // metamask.onAccountChange(()  signOut());
    }

    getDiscordAccessToken(): string | null {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        return fragment.get('discord_access_token');
    }

    clearDiscordAccessToken() {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        fragment.delete('discord_access_token');
        window.location.hash = '#' + fragment.toString();
    }

    async signUp(address: string) {
        address = address.toLowerCase();
        const message = await this.getSecurityChallenge(address);
        const { signature, signerAddress } = await metamask.signMessage(message);

        if (address !== signerAddress.toLowerCase()) {
            throw new InvalidSignerError();
        }

        const resp = await this.mutate<{ payload: SignInToken }>(SIGN_UP, {
            address,
            message,
            signature,
        });

        if (resp.errors) {
            throw resp.errors;
        }

        return signInWithCustomToken(this.firebaseAuth, resp.data!.payload.token);
    }

    async signIn(address: string) {
        address = address.toLowerCase();
        const message = await this.getSecurityChallenge(address);
        const { signature, signerAddress } = await metamask.signMessage(message);

        if (address !== signerAddress.toLowerCase()) {
            throw new InvalidSignerError();
        }

        const resp = await this.mutate<{ payload: SignInToken }>(SIGN_IN, {
            address,
            message,
            signature,
        });

        if (resp.errors) {
            throw resp.errors;
        }

        return signInWithCustomToken(this.firebaseAuth, resp.data!.payload.token);
    }

    async signOut() {
        await this.firebaseAuth.signOut();
    }

    async authorizeDiscord(returnTo: string) {
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
        const resp = await this.mutate<{ payload: ConnectDiscordOutput }>(CONNECT_DISCORD, {
            accessToken,
        });

        if (resp.errors) {
            throw resp.errors;
        }
    }

    async disconnectDiscord(discordId: string) {
        // hasura bind discord
        const resp = await this.mutate<{ payload: DisconnectDiscordOutput }>(DISCONNECT_DISCORD, {
            discordId,
        });

        if (resp.errors) {
            throw resp.errors;
        }
    }

    async connectTwitter() {
        const auth = getAuth();
        const provider = new TwitterAuthProvider();

        const result = await linkWithPopup(auth.currentUser!, provider);
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const secret = credential?.secret;
        const idToken = await result.user.getIdToken();
        await this.mutate<ConnectTwitterResponse>(CONNECT_TWITTER, {
            idToken,
            accessToken,
            secret,
        });
    }

    onAuthStateChanged(callback: NextOrObserver<User | null>) {
        this.firebaseAuth.onAuthStateChanged(callback);
    }

    async disconnectTwitter() {
        const auth = getAuth();
        const provider = new TwitterAuthProvider();
        const user = auth.currentUser!;
        await unlink(user, provider.providerId);
        await this.mutate<{ disconnectTwitter: DisconnectTwitterResponse }>(DISCONNECT_TWITTER);
    }
}
