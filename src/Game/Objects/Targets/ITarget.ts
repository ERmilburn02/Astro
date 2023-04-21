import { DisplayObject, Point } from "pixi.js";

// TODO: Make a base class that handles the movement logic

export interface ITarget extends DisplayObject {
  startPos: Point;
  movePosArr: Point[];

  isDouble: boolean;
  isLife: boolean;
  isHit: boolean;

  constructorWithAssets(): void;
  hit(): void;
  update(framesPassed: number): void;
  getCurrentPos(): Point;
  nextPos(): void;
}
