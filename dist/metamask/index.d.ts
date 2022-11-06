import { MetaMaskInpageProvider } from '@metamask/providers';
import { ExternalProvider } from '@ethersproject/providers';
declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider & ExternalProvider;
    }
}
interface SignedMessage {
    message: string;
    signature: string;
    signerAddress: string;
}
export declare const isInstalled: () => boolean;
export declare const isConnected: () => boolean;
/**
 * @return eth wallet address string or null
 */
export declare const connect: () => Promise<string | null>;
/**
 * @return eth wallet address string or null
 */
export declare const getAccount: () => Promise<string | null>;
export declare const onAccountChange: (callback: (account: string) => void) => void;
export declare const signMessage: (message: string) => Promise<SignedMessage>;
export {};
