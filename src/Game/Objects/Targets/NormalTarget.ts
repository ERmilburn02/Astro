import { Point, Rectangle } from "pixi.js";
import { BaseTarget } from "./BaseTarget";

export class NormalTarget extends BaseTarget {
  constructor(
    startPos: Point = new Point(0, 0),
    movePosArr: Point[] = [],
    isDouble: boolean = false,
    isLife: boolean = false,
    showDebugCollider: boolean = false
  ) {
    super("Target", startPos, movePosArr, isDouble, isLife, showDebugCollider);

    this.pivot.set(8);

    this.hitArea = new Rectangle(2, 1, 12, 12);
  }
}
