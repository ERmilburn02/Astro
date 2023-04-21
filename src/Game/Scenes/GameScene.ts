import { Container, DisplayObject, Point, Rectangle, Sprite } from "pixi.js";
import { IScene } from "../../Engine/IScene";
import { Player } from "../Objects/Player";
import { Manager } from "../../Engine/Manager";
import { ITarget } from "../Objects/Targets/ITarget";
import { NormalTarget } from "../Objects/Targets/NormalTarget";
import { Level, Vec2 } from "../types";
import { Level_1 } from "../Levels";

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

    this.sortableChildren = true;
  }

  constructorWithAssets(): void {
    this.player.constructorWithAssets();

    this.player.position.set(Manager.width / 2, Manager.height - 4 - 22);
    this.addChild(this.player);

    this.loadLayout(Level_1);

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
    });
  }

  cleanup(): void {
    this.player.cleanup();
  }

  private checkCollision(obj1: DisplayObject, obj2: DisplayObject): boolean {
    let hitArea1 = obj1.hitArea;
    let hitArea2 = obj2.hitArea;

    if (!(hitArea1 instanceof Rectangle) || !(hitArea2 instanceof Rectangle)) {
      throw new Error("Invalid hitArea: must be of type Rectangle");
    }

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

  private loadLayout(layout: Level): void {
    // First, clear the current layout
    this.targets.forEach((target) => {
      this.removeChild(target);
      target.destroy();
    });
    this.targets = [];

    // Then, load the new layout
    layout.targets.forEach((layoutTarget) => {
      let target: ITarget;

      switch (layoutTarget.type) {
        case "Target":
          target = new NormalTarget(
            this.Vec2ToPoint(layoutTarget.startPos),
            this.Vec2ArrayToPointArray(layoutTarget.points),
            layoutTarget.isDouble,
            layoutTarget.isLife,
            this.showDebugCollider
          );
          break;
        case "Target_Small":
        case "Target_Wide":
        case "Target_Grow":
          throw new Error("Not implemented");
        default:
          throw new Error("Invalid target type");
      }

      target.constructorWithAssets();
      target.position.set(target.startPos.x, target.startPos.y); // This should probably be done at the end of constructorWithAssets()
      this.addChild(target);
      this.targets.push(target);
    });

    // Reset the player
    this.player.reset();
  }

  private Vec2ToPoint(vec: Vec2): Point {
    return new Point(vec.x, vec.y);
  }

  private Vec2ArrayToPointArray(vecArray: Vec2[]): Point[] {
    let pointArray: Point[] = [];

    vecArray.forEach((vec) => {
      pointArray.push(this.Vec2ToPoint(vec));
    });

    return pointArray;
  }
}
