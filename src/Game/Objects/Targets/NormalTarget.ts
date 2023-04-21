import { Container, Graphics, Point, Rectangle, Sprite } from "pixi.js";
import { ITarget } from "./ITarget";

export class NormalTarget extends Container implements ITarget {
  private sprite: Sprite = new Sprite();

  isDouble: boolean = false; // Requires two hits
  isLife: boolean = false; // Gives an extra life if hit first
  isHit: boolean = false; // Has been hit, don't update anymore

  startPos: Point = new Point(0, 0);
  movePosArr: Point[] = [];
  currentPosIndex: number = 0;
  moveDirection: number = 1;

  private showDebugCollider: boolean = false;
  private hitAreaDebug: Graphics = new Graphics();

  constructor(
    startPos: Point = new Point(0, 0),
    movePosArr: Point[] = [],
    isDouble: boolean = false,
    isLife: boolean = false,
    showDebugCollider: boolean = false
  ) {
    super();

    this.pivot.set(8);

    this.hitArea = new Rectangle(2, 1, 12, 12);

    this.startPos = startPos;
    this.movePosArr = movePosArr;

    this.isDouble = isDouble;
    this.isLife = isLife;

    this.showDebugCollider = showDebugCollider;
  }
  getCurrentPos(): Point {
    return this.movePosArr[this.currentPosIndex];
  }
  nextPos(): void {
    // At the end of the array, reverse direction
    if (this.currentPosIndex === this.movePosArr.length - 1) {
      this.moveDirection = -1;
    }

    // At the start of the array, reverse direction
    if (this.currentPosIndex === 0) {
      this.moveDirection = 1;
    }

    this.currentPosIndex += this.moveDirection;
  }

  constructorWithAssets(): void {
    let spriteString = "Target";

    if (this.isHit) {
      spriteString += "_Hit";
    } else if (this.isDouble) {
      spriteString += "_Double";
    } else if (this.isLife) {
      spriteString += "_Life";
    }

    this.sprite = Sprite.from(spriteString);

    this.addChild(this.sprite);

    if (this.showDebugCollider) {
      this.addChild(this.hitAreaDebug);
    } else {
      this.hitAreaDebug.destroy();
    }
  }

  public update(framesPassed: number): void {
    framesPassed;

    if (this.showDebugCollider) {
      this.hitAreaDebug.clear();
      this.hitAreaDebug.beginFill(0xff00ff, 0.5);
      let hitArea = this.hitArea as Rectangle;
      this.hitAreaDebug.drawRect(
        hitArea.x,
        hitArea.y,
        hitArea.width,
        hitArea.height
      );
      this.hitAreaDebug.endFill();
    }
  }

  public hit(): void {
    if (this.isHit) {
      return; // Already hit
    }

    if (this.isDouble) {
      this.isDouble = false;

      this.sprite.texture = Sprite.from("Target").texture;
      return;
    }

    if (this.isLife) {
      // TODO: Ask if we were the first to be hit
      this.isLife = false;
      this.isHit = true;

      this.sprite.texture = Sprite.from("Target_Hit").texture;
      return;
    }

    this.isHit = true;

    this.sprite.texture = Sprite.from("Target_Hit").texture;
    return;
  }
}
