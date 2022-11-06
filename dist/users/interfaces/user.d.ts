import { DiscordProfile } from './discord-profile';
export interface User {
    bannerImgPath: string;
    bio: string;
    createdAt: Date;
    discordId: string;
    id: string;
    profilePicPath: string;
    twitterId: string;
    updatedAt: Date;
    username: string;
    discord?: DiscordProfile;
    discriminator: string;
}
export interface UserWithWallet extends User {
    wallets: Wallet[];
}
export interface Wallet {
    address: string;
    userId: string;
}
