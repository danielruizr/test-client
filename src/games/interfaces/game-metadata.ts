import { GameMetadataKey } from '../enums/game-metadata-key';
import { GameMetadataType } from '../enums/game-metadata-type';

export interface GameMetadata {
  id?: string;
  metaType: GameMetadataType;
  metaKey: GameMetadataKey;
  metaValue: string;
}
