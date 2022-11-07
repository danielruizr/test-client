import { GamePublisher } from './interfaces';
import { LIST_GAME_PUBLISHERS } from './queries/list-game-publishers';
import { CREATE_GAME_PUBLISHER } from './queries/create-game-publisher';
import { UPDATE_GAME_PUBLISHER } from './queries/update-game-publisher';
import { DELETE_GAME_PUBLISHER } from './queries/delete-game-publisher';
import { EarnAllianceBaseClient } from 'src/base';

export class EarnAllianceGamePublishers extends EarnAllianceBaseClient {
    async createGamePublisher(gamePublisher: Partial<GamePublisher>) {
        const { data } = await this.mutate<{ payload: GamePublisher }>(
            CREATE_GAME_PUBLISHER,
            {
                input: {
                    ...gamePublisher,
                },
            },
            { role: 'editor' }
        );

        return data?.payload;
    }

    async updateGamePublisher(id: string, input: Partial<GamePublisher>) {
        const { data } = await this.mutate<{ payload: GamePublisher }>(
            UPDATE_GAME_PUBLISHER,
            {
                id,
                input,
            },
            { role: 'editor' }
        );

        return data?.payload;
    }

    async listGamePublishers(forceRefresh: boolean = false) {
        const { data } = await this.query<{ payload: GamePublisher[] }>(LIST_GAME_PUBLISHERS, undefined, { forceRefresh });

        return data?.payload;
    }

    async deleteGamePublisher(id: string) {
        const { data } = await this.mutate<{
            payload: GamePublisher;
        }>(DELETE_GAME_PUBLISHER, { id }, { role: 'editor' });

        return data?.payload;
    }
}
