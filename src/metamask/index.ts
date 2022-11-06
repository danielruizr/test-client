import { MetaMaskInpageProvider } from '@metamask/providers';
import { ExternalProvider } from '@ethersproject/providers';
import { NoMetamaskInstallationError } from './errors/no-metamask-installation.error';
import { MetamaskNotConnectedError } from './errors/metamask-not-connected.error';
import { ethers } from 'ethers';

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

export const isInstalled = (): boolean => window.ethereum?.isMetaMask;

export const isConnected = (): boolean => window.ethereum?.isConnected();

const _validateMetamaskStatus = () => {
  if (!isInstalled() || !window.ethereum?.isMetaMask) {
    throw new NoMetamaskInstallationError();
  }

  if (!isConnected()) {
    throw new MetamaskNotConnectedError();
  }
};

const _request = async <T>(request: {
  method: string;
  params?: Array<any>;
}) => {
  _validateMetamaskStatus();
  return window.ethereum?.request<T>(request);
};

/**
 * @return eth wallet address string or null
 */
export const connect = async (): Promise<string | null> => {
  const accounts = await _request<string[]>({ method: 'eth_requestAccounts' });
  return accounts?.[0] || null;
};

/**
 * @return eth wallet address string or null
 */
export const getAccount = async (): Promise<string | null> => {
  const accounts = await _request<string[]>({ method: 'eth_accounts' });
  return accounts?.[0] || null;
};

export const onAccountChange = (callback: (account: string) => void) => {
  window.ethereum?.on('accountsChanged', (...args: unknown[]) => {
    const accounts = args?.[0] as string[];
    callback(accounts?.[0]);
  });
};

export const signMessage = async (message: string): Promise<SignedMessage> => {
  _validateMetamaskStatus();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
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
