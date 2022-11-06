import * as hasuraService from '../hasura';
import { GamePublisher } from './interfaces';
import { LIST_GAME_PUBLISHERS } from './queries/list-game-publishers';
import { CREATE_GAME_PUBLISHER } from './queries/create-game-publisher';
import { UPDATE_GAME_PUBLISHER } from './queries/update-game-publisher';
import { DELETE_GAME_PUBLISHER } from './queries/delete-game-publisher';

export const createGamePublisher = async (
  gamePublisher: Partial<GamePublisher>
) => {
  const { data } = await hasuraService.mutate<{ payload: GamePublisher }>(
    CREATE_GAME_PUBLISHER,
    {
      input: {
        ...gamePublisher,
      },
    },
    { role: 'editor' }
  );

  return data?.payload;
};

export const updateGamePublisher = async (
  id: string,
  input: Partial<GamePublisher>
) => {
  const { data } = await hasuraService.mutate<{ payload: GamePublisher }>(
    UPDATE_GAME_PUBLISHER,
    {
      id,
      input,
    },
    { role: 'editor' }
  );

  return data?.payload;
};

export const listGamePublishers = async (forceRefresh: boolean = false) => {
  const { data } = await hasuraService.query<{ payload: GamePublisher[] }>(
    LIST_GAME_PUBLISHERS,
    undefined,
    { forceRefresh }
  );

  return data?.payload;
};

export const deleteGamePublisher = async (id: string) => {
  const { data } = await hasuraService.mutate<{
    payload: GamePublisher;
  }>(DELETE_GAME_PUBLISHER, { id }, { role: 'editor' });

  return data?.payload;
};
