import { MetaMaskInpageProvider } from '@metamask/providers';
import { ExternalProvider } from '@ethersproject/providers';
import { NoMetamaskInstallationError } from './errors/no-metamask-installation.error';
import { MetamaskNotConnectedError } from './errors/metamask-not-connected.error';
import { ethers } from 'ethers';
import { EarnAllianceBaseClient } from 'src/base';

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

export class EarnAllianceMetaMaskClient extends EarnAllianceBaseClient {
    isInstalled(): boolean {
        return window.ethereum?.isMetaMask;
    }

    isConnected(): boolean {
        return window.ethereum?.isConnected();
    }

    _validateMetamaskStatus() {
        if (!this.isInstalled() || !window.ethereum?.isMetaMask) {
            throw new NoMetamaskInstallationError();
        }

        if (!this.isConnected()) {
            throw new MetamaskNotConnectedError();
        }
    }

    async _request<T>(request: { method: string; params?: Array<any> }) {
        this._validateMetamaskStatus();
        return window.ethereum?.request<T>(request);
    }

    /**
     * @return eth wallet address string or null
     */
    async connect(): Promise<string | null> {
        const accounts = await this._request<string[]>({ method: 'eth_requestAccounts' });
        return accounts?.[0] || null;
    }

    /**
     * @return eth wallet address string or null
     */
    async getAccount(): Promise<string | null> {
        const accounts = await this._request<string[]>({ method: 'eth_accounts' });
        return accounts?.[0] || null;
    }

    onAccountChange(callback: (account: string) => void) {
        window.ethereum?.on('accountsChanged', (...args: unknown[]) => {
            const accounts = args?.[0] as string[];
            callback(accounts?.[0]);
        });
    }

    async signMessage(message: string): Promise<SignedMessage> {
        this._validateMetamaskStatus();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const [signature, signerAddress] = await Promise.all([signer.signMessage(message), signer.getAddress()]);

        return {
            message,
            signature,
            signerAddress,
        };
    }
}
