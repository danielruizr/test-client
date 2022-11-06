import { User, UserWithWallet } from './interfaces';
export declare const getUser: (id: string, forceRefresh?: boolean) => Promise<User>;
export declare const getUserWithWallets: (id: string, forceRefresh?: boolean) => Promise<UserWithWallet>;
export declare const updateUser: (data: Partial<Pick<User, 'username' | 'profilePicPath' | 'bannerImgPath' | 'bio'>>) => Promise<Partial<User>>;
export declare const updateLastSeen: () => void;
export declare const connectWallet: (address: string) => Promise<UserWithWallet>;
