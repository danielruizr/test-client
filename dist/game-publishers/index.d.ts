import { GamePublisher } from './interfaces';
export declare const createGamePublisher: (gamePublisher: Partial<GamePublisher>) => Promise<GamePublisher | undefined>;
export declare const updateGamePublisher: (id: string, input: Partial<GamePublisher>) => Promise<GamePublisher | undefined>;
export declare const listGamePublishers: (forceRefresh?: boolean) => Promise<GamePublisher[]>;
export declare const deleteGamePublisher: (id: string) => Promise<GamePublisher | undefined>;
