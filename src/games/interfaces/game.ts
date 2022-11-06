import { GameAsset } from './game-asset';
import { Blockchain } from '../../blockchains/interfaces';
import { GameMetadata } from './game-metadata';
import { GameGenre } from './game-genre';
import { GamePlatform } from './game-platform';


export interface Game {
  id: string;
  name: string;
  intro: string;
  description: string;
  publisherId?: string;
  releasedAt?: string;
  listedAt?: string;
  featuredAt?: string;
  genres?: GameGenre[];
  platforms?: GamePlatform[];
  trailers: GameAsset[];
  thumbnails: GameAsset[];
  snapshots: GameAsset[];
  website?: GameMetadata;
  discord?: GameMetadata;
  twitter?: GameMetadata;
  telegram?: GameMetadata;
  facebook?: GameMetadata;
  youtube?: GameMetadata;
  slug: string;
}

export interface WithBlockchains {
  blockchains?: Blockchain[];
}
export interface WithGenres {
}
