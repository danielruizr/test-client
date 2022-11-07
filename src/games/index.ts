import { GET_GAME } from './queries/get-game';
import { Game, GameAsset, GameGenreEnum, GameId, GamePlatformEnum, WithBlockchains } from './interfaces';
import { GET_GAME_BY_SLUG } from './queries/get-game-by-slug';
import { LIST_GAMES } from './queries/list-games';
import { CREATE_GAME } from './queries/create-game';
import { UPDATE_GAME } from './queries/update-game';
import { CREATE_GAME_ASSET } from './queries/create-game-asset';
import { UPDATE_GAME_ASSET } from './queries/update-game-asset';
import { DELETE_GAME_ASSET } from './queries/delete-game-asset';
import { LIST_GAME_ASSETS } from './queries/list-game-assets';
import { CREATE_GAME_METADATA } from './queries/create-game-metadata';
import { Blockchain } from '../blockchains/interfaces';
import { DELETE_GAME_BLOCKCHAINS } from './queries/delete-game-blockchains';
import { CREATE_GAME_BLOCKCHAINS } from './queries/create-game-blockchains';
import { GameMetadata } from './interfaces/game-metadata';
import { GameMetadataKey } from './enums/game-metadata-key';
import { DELETE_GAME_GENRE } from './queries/delete-game-genre';
import { LIST_FAVORITE_GAMES } from './queries/list-favorite-games';
import { CREATE_GAME_GENRE } from './queries/create-game-genre';
import { CREATE_GAME_PLATFORM } from './queries/create-game-platform';
import { DELETE_GAME_PLATFORM } from './queries/delete-game-platform';
import { DELETE_GAME } from './queries/delete-game';
type GamePayload = Game & { blockchains: { blockchain: Blockchain }[] } & { metadata: GameMetadata[] };
import { FOLLOW_GAME } from './queries/follow-game';
import { EarnAllianceBaseClient } from 'src/base';

export class EarnAllianceGamesClient extends EarnAllianceBaseClient {
    parseGamePayload(payload?: GamePayload): (Game & WithBlockchains) | null {
        if (!payload) {
            return null;
        }
        return {
            ...payload,
            blockchains: payload.blockchains?.map(item => item.blockchain),
            website: payload.metadata?.find(v => v.metaKey === GameMetadataKey.HomePage),
            discord: payload.metadata?.find(v => v.metaKey === GameMetadataKey.Discord),
            twitter: payload.metadata?.find(v => v.metaKey === GameMetadataKey.Twitter),
            telegram: payload.metadata?.find(v => v.metaKey === GameMetadataKey.Telegram),
            facebook: payload.metadata?.find(v => v.metaKey === GameMetadataKey.Facebook),
            youtube: payload.metadata?.find(v => v.metaKey === GameMetadataKey.Youtube),
        };
    }

    async getGameById(id: string, forceRefresh: boolean = false): Promise<(Game & WithBlockchains) | null> {
        const { data } = await this.query<{
            payload: GamePayload;
        }>(GET_GAME, { id }, { forceRefresh });
        return this.parseGamePayload(data.payload);
    }

    async getGameBySlug(slug: string, forceRefresh: boolean = false): Promise<(Game & WithBlockchains) | null> {
        const { data } = await this.query<{
            payload: GamePayload[];
        }>(GET_GAME_BY_SLUG, { slug }, { forceRefresh });
        return this.parseGamePayload(data.payload?.[0]);
    }

    async getGame(gameId: GameId, forceRefresh: boolean = false): Promise<(Game & WithBlockchains) | null> {
        if (gameId.id) {
            return this.getGameById(gameId.id, forceRefresh);
        }

        if (gameId.slug) {
            return this.getGameBySlug(gameId.slug, forceRefresh);
        }

        return null;
    }

    async listGames(
        params?: { limit?: number; offset?: number; criteria?: any },
        forceRefresh: boolean = false
    ): Promise<(Game & WithBlockchains)[]> {
        const { limit, offset, criteria } = params || {};
        const { data } = await this.query<{ payload: GamePayload[] }>(
            LIST_GAMES,
            {
                limit: limit || 10,
                offset: offset || 0,
                criteria,
            },
            { forceRefresh }
        );
        const games = data.payload.map(item => this.parseGamePayload(item));

        return games.filter(game => game !== null) as (Game & WithBlockchains)[];
    }

    async createGame(input: Partial<Game>): Promise<Game & WithBlockchains> {
        const { data } = await this.mutate<{
            payload: GamePayload;
        }>(CREATE_GAME, { input }, { role: 'editor' });

        return this.parseGamePayload(data?.payload)!;
    }

    async updateGame(id: string, input: Partial<Game>): Promise<Game & WithBlockchains> {
        const { data } = await this.mutate<{
            payload: GamePayload;
        }>(UPDATE_GAME, { id, input }, { role: 'editor' });

        return this.parseGamePayload(data?.payload)!;
    }
    async deleteGame(id: string): Promise<void> {
        await this.mutate<{
            payload: any;
        }>(DELETE_GAME, { id }, { role: 'editor' });
    }

    async deleteGameBlockchains(gameId: string) {
        const { data } = await this.mutate<{
            payload: { affected_rows: number };
        }>(DELETE_GAME_BLOCKCHAINS, { gameId }, { role: 'editor' });

        return data?.payload?.affected_rows;
    }

    async createGameBlockchains(gameId: string, blockchainIds: string[]) {
        const { data } = await this.mutate<{
            payload: { affected_rows: number };
        }>(
            CREATE_GAME_BLOCKCHAINS,
            {
                input: blockchainIds.map(blockchainId => ({
                    gameId,
                    blockchainId,
                })),
            },
            { role: 'editor' }
        );

        return data?.payload;
    }

    async setGameBlockchains(gameId: string, blockchains: string[]) {
        await this.deleteGameBlockchains(gameId);
        await this.createGameBlockchains(gameId, blockchains);
    }

    async setGameGenres(gameId: string, genres: GameGenreEnum[]) {
        await this.deleteGameGenres(gameId);
        if (genres.length) await this.createGameGenres(gameId, genres);
    }

    async setGamePlatforms(gameId: string, platforms: GamePlatformEnum[]) {
        await this.deleteGamePlatforms(gameId);
        if (platforms.length) await this.createGamePlatforms(gameId, platforms);
    }

    async createGameMetadata(gameId: string, gameMetadata: GameMetadata) {
        const { data } = await this.mutate<{ payload: GameMetadata }>(
            CREATE_GAME_METADATA,
            {
                input: {
                    gameId,
                    ...gameMetadata,
                },
            },
            { role: 'editor' }
        );

        return data?.payload;
    }

    async createGameAsset(gameId: string, gameAsset: GameAsset) {
        const { data } = await this.mutate<{ payload: GameAsset }>(
            CREATE_GAME_ASSET,
            {
                input: {
                    gameId,
                    ...gameAsset,
                },
            },
            { role: 'editor' }
        );

        return data?.payload;
    }

    async updateGameAsset(id: string, input: GameAsset) {
        const { data } = await this.mutate<{ payload: GameAsset }>(
            UPDATE_GAME_ASSET,
            {
                id,
                input,
            },
            { role: 'editor' }
        );

        return data?.payload;
    }

    async listGameAssets(gameId: string, forceRefresh: boolean = false) {
        const { data } = await this.query<{ payload: GameAsset[] }>(LIST_GAME_ASSETS, { gameId }, { forceRefresh });

        return data?.payload;
    }

    async deleteGameAsset(id: string, gameId: string) {
        const { data } = await this.mutate<{
            payload: { affected_rows: number };
        }>(DELETE_GAME_ASSET, { id, gameId }, { role: 'editor' });

        return data?.payload?.affected_rows;
    }

    async createGameGenres(gameId: string, genres: GameGenreEnum[]) {
        const { data } = await this.mutate<{ payload: { affected_rows: number } }>(
            CREATE_GAME_GENRE,
            {
                input: genres.map(genre => ({ gameId, genre })),
            },
            { role: 'editor' }
        );

        return data?.payload?.affected_rows;
    }

    async deleteGameGenres(id: string) {
        const { data } = await this.mutate<{ payload: { affected_rows: number } }>(DELETE_GAME_GENRE, { id }, { role: 'editor' });

        return data?.payload?.affected_rows;
    }

    async createGamePlatforms(gameId: string, platforms: GamePlatformEnum[]) {
        const { data } = await this.mutate<{ payload: { affected_rows: number } }>(
            CREATE_GAME_PLATFORM,
            {
                input: platforms.map(platform => ({ gameId, platform })),
            },
            { role: 'editor' }
        );

        return data?.payload?.affected_rows;
    }

    async deleteGamePlatforms(id: string) {
        const { data } = await this.mutate<{ payload: { affected_rows: number } }>(DELETE_GAME_PLATFORM, { id }, { role: 'editor' });

        return data?.payload?.affected_rows;
    }

    async followGame(id: string): Promise<boolean | null> {
        const { data } = await this.mutate<{
            payload: { success: boolean };
        }>(FOLLOW_GAME, { id });
        return data?.payload.success || false;
    }

    async istFavoriteGames(params?: { limit?: number; offset?: number }, forceRefresh: boolean = false): Promise<Game[]> {
        const { limit, offset } = params || {};
        const { data } = await this.query<{ payload: { game: Game }[] }>(
            LIST_FAVORITE_GAMES,
            {
                limit: limit || 10,
                offset: offset || 0,
            },
            { forceRefresh }
        );
        return data.payload.map(item => item.game);
    }
}
