import { DisplayObject } from "pixi.js";

export interface IScene extends DisplayObject {
  assetBundles: string[];
  constructorWithAssets(): void;
  update(framesPassed: number): void;
  cleanup(): void;
}
