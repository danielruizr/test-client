import * as metamask from '../metamask';
import { InvalidSignerError } from './errors/invalid-signer.error';
import { firebaseAuth } from '../firebase';
import { NextOrObserver, signInWithCustomToken, User } from '@firebase/auth';
import * as hasuraService from '../hasura';
import {
  GET_SECURITY_CHALLENGE,
  SIGN_UP,
  SIGN_IN,
  CONNECT_DISCORD,
  CONNECT_TWITTER,
  DISCONNECT_DISCORD,
  DISCONNECT_TWITTER,
} from './queries';
import {
  DisconnectDiscordOutput,
  DisconnectTwitterResponse,
  SecurityChallenge,
  SignInToken,
} from './interfaces';
import { ConnectDiscordOutput, ConnectTwitterResponse } from './interfaces';
import {
  getAuth,
  linkWithPopup,
  TwitterAuthProvider,
  unlink,
} from 'firebase/auth';

export const getSecurityChallenge = async (address: string) => {
  const resp = await hasuraService.query<{ payload: SecurityChallenge }>(
    GET_SECURITY_CHALLENGE,
    { address }
  );
  return resp.data.payload.challenge;
};

let hasInit = false;
export const initialize = async () => {
  if (hasInit) {
    return;
  }

  hasInit = true;

  // metamask.onAccountChange(() => signOut());
};

export const getAccessToken = async (
  forceRefresh: boolean = false
): Promise<string | undefined> => {
  return getCurrentUser()?.getIdToken(forceRefresh);
};

const getDiscordAccessToken = (): string | null => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  return fragment.get('discord_access_token');
};

const clearDiscordAccessToken = () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  fragment.delete('discord_access_token');
  window.location.hash = '#' + fragment.toString();
};

export const signUp = async (address: string) => {
  address = address.toLowerCase();
  const message = await getSecurityChallenge(address);
  const { signature, signerAddress } = await metamask.signMessage(message);

  if (address !== signerAddress.toLowerCase()) {
    throw new InvalidSignerError();
  }

  const resp = await hasuraService.mutate<{ payload: SignInToken }>(SIGN_UP, {
    address,
    message,
    signature,
  });

  if (resp.errors) {
    throw resp.errors;
  }

  return signInWithCustomToken(firebaseAuth, resp.data!.payload.token);
};

export const signIn = async (address: string) => {
  address = address.toLowerCase();
  const message = await getSecurityChallenge(address);
  const { signature, signerAddress } = await metamask.signMessage(message);

  if (address !== signerAddress.toLowerCase()) {
    throw new InvalidSignerError();
  }

  const resp = await hasuraService.mutate<{ payload: SignInToken }>(SIGN_IN, {
    address,
    message,
    signature,
  });

  if (resp.errors) {
    throw resp.errors;
  }

  return signInWithCustomToken(firebaseAuth, resp.data!.payload.token);
};

export const signOut = async () => {
  await firebaseAuth.signOut();
};

export const authorizeDiscord = async (returnTo: string) => {
  const url = new URL(`/discord/authorize`); // ** ADD URL
  url.searchParams.append('return_to', returnTo);
  window.location.href = url.toString();
};

export const connectDiscord = async () => {
  const accessToken = getDiscordAccessToken();
  clearDiscordAccessToken();
  if (!accessToken || !getCurrentUser()) {
    return;
  }
  // hasura bind discord
  const resp = await hasuraService.mutate<{ payload: ConnectDiscordOutput }>(
    CONNECT_DISCORD,
    {
      accessToken,
    }
  );

  if (resp.errors) {
    throw resp.errors;
  }
};

export const disconnectDiscord = async (discordId: string) => {
  // hasura bind discord
  const resp = await hasuraService.mutate<{ payload: DisconnectDiscordOutput }>(
    DISCONNECT_DISCORD,
    {
      discordId,
    }
  );

  if (resp.errors) {
    throw resp.errors;
  }
};

export const connectTwitter = async () => {
  const auth = getAuth();
  const provider = new TwitterAuthProvider();

  const result = await linkWithPopup(auth.currentUser!, provider);
  const credential = TwitterAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;
  const secret = credential?.secret;
  const idToken = await result.user.getIdToken();
  await hasuraService.mutate<ConnectTwitterResponse>(CONNECT_TWITTER, {
    idToken,
    accessToken,
    secret,
  });
};

export const getCurrentUser = () => firebaseAuth.currentUser;

export const onAuthStateChanged = (callback: NextOrObserver<User | null>) => {
  firebaseAuth.onAuthStateChanged(callback);
};

export const disconnectTwitter = async () => {
  const auth = getAuth();
  const provider = new TwitterAuthProvider();
  const user = auth.currentUser!;
  await unlink(user, provider.providerId);
  await hasuraService.mutate<{ disconnectTwitter: DisconnectTwitterResponse }>(
    DISCONNECT_TWITTER
  );
};
