import { Container, DisplayObject, Point, Rectangle, Sprite } from "pixi.js";
import { IScene } from "../../Engine/IScene";
import { Player } from "../Objects/Player";
import { Manager } from "../../Engine/Manager";
import { ITarget } from "../Objects/Targets/ITarget";
import { NormalTarget } from "../Objects/Targets/NormalTarget";

// TODO: Move Target Movement Logic into Target Class

export class GameScene extends Container implements IScene {
  assetBundles: string[] = ["game"];

  private player: Player;
  private foreground: Sprite = new Sprite();
  private targets: ITarget[] = [];

  private showDebugCollider: boolean = false;

  constructor(showDebugCollider: boolean = false) {
    super();

    this.showDebugCollider = showDebugCollider;

    this.player = new Player(this.showDebugCollider);

    this.targets.push(
      new NormalTarget(
        new Point(Manager.width / 2, Manager.height / 2 - 32),
        [
          new Point(8 + 17, Manager.height / 2 - 32),
          new Point(Manager.width - 8 - 12, Manager.height / 2 - 32),
        ],
        false,
        false,
        this.showDebugCollider
      )
    );
    this.targets.push(
      new NormalTarget(
        new Point(Manager.width / 2 + 16, Manager.height / 2 - 16),
        [
          new Point(8 + 17, Manager.height / 2 - 16),
          new Point(Manager.width - 8 - 12, Manager.height / 2 - 16),
        ],
        false,
        false,
        this.showDebugCollider
      )
    );
    this.targets.push(
      new NormalTarget(
        new Point(Manager.width / 2, Manager.height / 2),
        [
          new Point(8 + 17, Manager.height / 2),
          new Point(Manager.width - 8 - 12, Manager.height / 2),
        ],
        false,
        false,
        this.showDebugCollider
      )
    );
    this.targets.push(
      new NormalTarget(
        new Point(Manager.width / 2 + 16, Manager.height / 2 + 16),
        [
          new Point(8 + 17, Manager.height / 2 + 16),
          new Point(Manager.width - 8 - 12, Manager.height / 2 + 16),
        ],
        false,
        false,
        this.showDebugCollider
      )
    );

    this.sortableChildren = true;
  }

  constructorWithAssets(): void {
    this.player.constructorWithAssets();

    this.player.position.set(Manager.width / 2, Manager.height - 4 - 22);
    this.addChild(this.player);

    this.targets.forEach((target) => {
      target.constructorWithAssets();
      target.position.set(target.startPos.x, target.startPos.y);
      this.addChild(target);
    });

    this.foreground = Sprite.from("Frame");
    this.foreground.anchor.set(0.5, 0.5);
    this.foreground.position.set(Manager.width / 2, Manager.height / 2);
    this.foreground.zIndex = 10;
    this.addChild(this.foreground);
  }

  public update(framesPassed: number): void {
    this.player.update(framesPassed);

    this.targets.forEach((target) => {
      target.update(framesPassed);

      this.player.getBullets().forEach((bullet) => {
        if (this.checkCollision(bullet, target)) {
          this.player.removeBullet(bullet);
          target.hit();
        }
      });

      if (!target.isHit) {
        this.moveTarget(framesPassed, target);
      }
    });
  }

  cleanup(): void {
    this.player.cleanup();
  }

  private checkCollision(obj1: DisplayObject, obj2: DisplayObject): boolean {
    let hitArea1 = obj1.hitArea as Rectangle;
    let hitArea2 = obj2.hitArea as Rectangle;

    let x1 = obj1.x - obj1.pivot.x + hitArea1.x;
    let y1 = obj1.y - obj1.pivot.y + hitArea1.y;
    let w1 = hitArea1.width;
    let h1 = hitArea1.height;

    let x2 = obj2.x - obj2.pivot.x + hitArea2.x;
    let y2 = obj2.y - obj2.pivot.y + hitArea2.y;
    let w2 = hitArea2.width;
    let h2 = hitArea2.height;

    if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
      return true;
    }

    return false;
  }

  private moveTarget(framesPassed: number, target: ITarget): void {
    let moveTowards: Point = target.getCurrentPos();

    // Test if target is within 1 pixel of the target position
    if (
      Math.abs(target.x - moveTowards.x) < 1 &&
      Math.abs(target.y - moveTowards.y) < 1
    ) {
      target.nextPos();
      moveTowards = target.getCurrentPos();
    }

    let moveX: number = 0;
    let moveY: number = 0;

    if (target.x < moveTowards.x) {
      moveX = 0.5;
    } else if (target.x > moveTowards.x) {
      moveX = -0.5;
    }

    if (target.y < moveTowards.y) {
      moveY = 0.5;
    } else if (target.y > moveTowards.y) {
      moveY = -0.5;
    }

    target.position.x += moveX * framesPassed;
    target.position.y += moveY * framesPassed;
  }
}