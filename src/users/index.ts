import * as metamask from '../metamask';
import { getSecurityChallenge } from 'services/auth';
import * as hasuraService from '../hasura';
import { User, UserWithWallet } from './interfaces';
import { CONNECT_WALLET, GET_USER, UPDATE_USER, UPDATE_LAST_SEEN, GET_USER_WITH_WALLETS } from './queries';
import { InvalidSignerError } from 'services/auth/errors/invalid-signer.error';
import Cookies from 'js-cookie';

export const getUser = async (id: string, forceRefresh: boolean = false) => {
    const { data } = await hasuraService.query<{ payload: User }>(GET_USER, { id }, { forceRefresh });
    return data.payload;
};
export const getUserWithWallets = async (id: string, forceRefresh: boolean = false) => {
    const { data } = await hasuraService.query<{ payload: UserWithWallet }>(GET_USER_WITH_WALLETS, { id }, { forceRefresh });
    return data.payload;
};

export const updateUser = async (data: Partial<Pick<User, 'username' | 'profilePicPath' | 'bannerImgPath' | 'bio'>>) => {
    const { data: res } = await hasuraService.mutate<{ payload: Partial<User> }>(UPDATE_USER, { data });
    return res!.payload;
};

export const updateLastSeen = () => {
    const key = '_ea_last_seen_updated_at';
    const now = new Date();
    const updateInterval = 30 * 60 * 1000; // 30 mins
    const lastSeenUpdate = Cookies.get(key);

    if (now.getTime() - parseInt(lastSeenUpdate || '0') < updateInterval) {
        // don't update
        return;
    }

    Cookies.set(key, new Date().getTime().toString(), {
        expires: new Date(now.getTime() + updateInterval),
    });

    hasuraService.mutate(UPDATE_LAST_SEEN).catch(() => {
        // don't care if that's a fail. just ignore
    });
};
export const connectWallet = async (address: string) => {
    address = address.toLowerCase();
    const message = await getSecurityChallenge(address);
    const { signature, signerAddress } = await metamask.signMessage(message);

    if (address !== signerAddress.toLowerCase()) {
        throw new InvalidSignerError();
    }

    const resp = await hasuraService.mutate<{ payload: UserWithWallet }>(CONNECT_WALLET, {
        address,
        message,
        signature,
    });

    if (resp.errors) {
        throw resp.errors;
    }

    return resp.data!.payload;
};
