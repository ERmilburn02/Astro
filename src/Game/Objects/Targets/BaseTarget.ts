import { Container, Graphics, Point, Rectangle, Sprite } from "pixi.js";
import { ITarget } from "./ITarget";
import { TargetType } from "../../types";

export abstract class BaseTarget extends Container implements ITarget {
  startPos: Point = new Point(0, 0);
  movePosArr: Point[] = [];
  sprite: Sprite = new Sprite();
  spriteBaseName: TargetType = "Target";
  isDouble: boolean = false;
  isLife: boolean = false;
  isHit: boolean = false;
  currentPosIndex: number = 0;
  moveDirection: number = 1;

  showDebugCollider: boolean = false;
  hitAreaDebug: Graphics = new Graphics();

  constructor(
    spriteBaseName: TargetType = "Target",
    startPos: Point = new Point(0, 0),
    movePosArr: Point[] = [],
    isDouble: boolean = false,
    isLife: boolean = false,
    showDebugCollider: boolean = false
  ) {
    super();

    this.startPos = startPos;
    this.movePosArr = movePosArr;
    this.isDouble = isDouble;
    this.isLife = isLife;

    this.spriteBaseName = spriteBaseName;

    this.showDebugCollider = showDebugCollider;
  }

  constructorWithAssets(): void {
    this.updateSprite();

    this.addChild(this.sprite);

    if (this.showDebugCollider) this.addChild(this.hitAreaDebug);
    else this.hitAreaDebug.destroy();
  }

  hit(): void {
    if (this.isHit) return;

    if (this.isDouble) {
      this.isDouble = false;

      this.updateSprite();

      return;
    }

    if (this.isLife) {
      this.isLife = false;
      this.isHit = true;

      this.updateSprite();

      return;
    }

    this.isHit = true;

    this.updateSprite();
  }

  update(framesPassed: number): void {
    if (!this.isHit) this.move(framesPassed);

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

  move(framesPassed: number): void {
    let moveTowards: Point = this.getCurrentPos();

    if (
      Math.abs(this.x - moveTowards.x) < 1 &&
      Math.abs(this.y - moveTowards.y) < 1
    ) {
      this.nextPos();
      moveTowards = this.getCurrentPos();
    }

    let moveX: number = 0;
    let moveY: number = 0;

    if (this.x < moveTowards.x) moveX = 1;
    else if (this.x > moveTowards.x) moveX = -1;

    if (this.y < moveTowards.y) moveY = 1;
    else if (this.y > moveTowards.y) moveY = -1;

    this.position.x += moveX * framesPassed;
    this.position.y += moveY * framesPassed;
  }

  updateSprite() {
    let spriteString = this.spriteBaseName;

    if (this.isHit) {
      spriteString += "-Hit";
    } else if (this.isDouble) {
      spriteString += "-Double";
    } else if (this.isLife) {
      spriteString += "-Life";
    }

    this.sprite.texture = Sprite.from(spriteString).texture;
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
}
