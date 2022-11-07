import Cookies from 'js-cookie';
import { User, UserWithWallet } from './interfaces';
import { CONNECT_WALLET, GET_USER, UPDATE_USER, UPDATE_LAST_SEEN, GET_USER_WITH_WALLETS } from './queries';
import { InvalidSignerError } from '../auth/errors/invalid-signer.error';
import { EarnAllianceMetaMaskClient } from 'src/metamask';

export class EarnAllianceUserClient extends EarnAllianceMetaMaskClient {
    async getUser(id: string, forceRefresh: boolean = false) {
        const { data } = await this.query<{ payload: User }>(GET_USER, { id }, { forceRefresh });
        return data.payload;
    }
    async getUserWithWallets(id: string, forceRefresh: boolean = false) {
        const { data } = await this.query<{ payload: UserWithWallet }>(GET_USER_WITH_WALLETS, { id }, { forceRefresh });
        return data.payload;
    }

    async updateUser(data: Partial<Pick<User, 'username' | 'profilePicPath' | 'bannerImgPath' | 'bio'>>) {
        const { data: res } = await this.mutate<{ payload: Partial<User> }>(UPDATE_USER, { data });
        return res!.payload;
    }

    updateLastSeen = () => {
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

        this.mutate(UPDATE_LAST_SEEN).catch(() => {
            // don't care if that's a fail. just ignore
        });
    };
    async connectWallet(address: string) {
        address = address.toLowerCase();
        const message = await this.getSecurityChallenge(address);
        const { signature, signerAddress } = await this.signMessage(message);

        if (address !== signerAddress.toLowerCase()) {
            throw new InvalidSignerError();
        }

        const resp = await this.mutate<{ payload: UserWithWallet }>(CONNECT_WALLET, {
            address,
            message,
            signature,
        });

        if (resp.errors) {
            throw resp.errors;
        }

        return resp.data!.payload;
    }
}
