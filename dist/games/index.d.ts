import { Game, GameAsset, GameGenreEnum, GameId, GamePlatformEnum, WithBlockchains } from './interfaces';
import { GameMetadata } from './interfaces/game-metadata';
export declare const getGame: (gameId: GameId, forceRefresh?: boolean) => Promise<(Game & WithBlockchains) | null>;
export declare const listGames: (params?: {
    limit?: number;
    offset?: number;
    criteria?: any;
}, forceRefresh?: boolean) => Promise<(Game & WithBlockchains)[]>;
export declare const createGame: (input: Partial<Game>) => Promise<Game & WithBlockchains>;
export declare const updateGame: (id: string, input: Partial<Game>) => Promise<Game & WithBlockchains>;
export declare const deleteGame: (id: string) => Promise<void>;
export declare const setGameBlockchains: (gameId: string, blockchains: string[]) => Promise<void>;
export declare const setGameGenres: (gameId: string, genres: GameGenreEnum[]) => Promise<void>;
export declare const setGamePlatforms: (gameId: string, platforms: GamePlatformEnum[]) => Promise<void>;
export declare const createGameMetadata: (gameId: string, gameMetadata: GameMetadata) => Promise<GameMetadata | undefined>;
export declare const createGameAsset: (gameId: string, gameAsset: GameAsset) => Promise<GameAsset | undefined>;
export declare const updateGameAsset: (id: string, input: GameAsset) => Promise<GameAsset | undefined>;
export declare const listGameAssets: (gameId: string, forceRefresh?: boolean) => Promise<GameAsset[]>;
export declare const deleteGameAsset: (id: string, gameId: string) => Promise<number | undefined>;
export declare const createGameGenres: (gameId: string, genres: GameGenreEnum[]) => Promise<number | undefined>;
export declare const deleteGameGenres: (id: string) => Promise<number | undefined>;
export declare const createGamePlatforms: (gameId: string, platforms: GamePlatformEnum[]) => Promise<number | undefined>;
export declare const deleteGamePlatforms: (id: string) => Promise<number | undefined>;
export declare const followGame: (id: string) => Promise<boolean | null>;
export declare const listFavoriteGames: (params?: {
    limit?: number;
    offset?: number;
}, forceRefresh?: boolean) => Promise<Game[]>;
