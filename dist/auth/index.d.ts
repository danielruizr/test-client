import { NextOrObserver, User } from '@firebase/auth';
import { EarnAllianceBaseClient } from '../base';
export declare class EarnAllianceAuthClient extends EarnAllianceBaseClient {
    getSecurityChallenge(address: string): Promise<string>;
    hasInit: boolean;
    initialize(): Promise<void>;
    getDiscordAccessToken(): string | null;
    clearDiscordAccessToken(): void;
    signUp(address: string): Promise<import("@firebase/auth").UserCredential>;
    signIn(address: string): Promise<import("@firebase/auth").UserCredential>;
    signOut(): Promise<void>;
    authorizeDiscord(returnTo: string): Promise<void>;
    connectDiscord(): Promise<void>;
    disconnectDiscord(discordId: string): Promise<void>;
    connectTwitter(): Promise<void>;
    onAuthStateChanged(callback: NextOrObserver<User | null>): void;
    disconnectTwitter(): Promise<void>;
}
