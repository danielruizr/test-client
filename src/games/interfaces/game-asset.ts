import { GameAssetType } from "../enums/game-asset-type";
import { GameAssetKey } from '../enums/game-asset-key';

export interface GameAsset {
  id?: string;
  assetType: GameAssetType;
  assetKey: GameAssetKey;
  assetValue: string;
}
