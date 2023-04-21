import { Sprite, Container, Graphics, Rectangle } from "pixi.js";
import { Manager } from "../../Engine/Manager";
import { Keyboard } from "../Keyboard";
import { Bullet } from "./Bullet";

// Let's be real, this is basically just a scene, so why not just make it a scene?
// I'm not sure, but I'm going to leave it as it is for now
export class Player extends Container {
  private blaster: Sprite = new Sprite();

  private showDebugCollider: boolean;
  private hitAreaDebug: Graphics = new Graphics();

  private bullets: Bullet[] = [];

  // Used to keep the player from going off the screen
  readonly PLAYER_LEFT_EDGE = 8 + 17;
  readonly PLAYER_RIGHT_EDGE = Manager.width - 8 - 12;

  private moveLeft: boolean = false;
  private moveRight: boolean = false;

  private initialBullets: number = 5;
  private currentBullets: number = -1;

  constructor(showDebugCollider: boolean = false) {
    super();

    this.pivot.set(8, 4);

    this.hitArea = new Rectangle(0, 0, 16, 8);

    this.showDebugCollider = showDebugCollider;
  }

  constructorWithAssets(): void {
    this.blaster = Sprite.from("Blaster");

    this.addChild(this.blaster);

    if (this.showDebugCollider) {
      this.addChild(this.hitAreaDebug);
    } else {
      this.hitAreaDebug.destroy();
    }

    Keyboard.addMapping("KeyA", this.callbackMoveLeft.bind(this));
    Keyboard.addMapping("KeyD", this.callbackMoveRight.bind(this));

    Keyboard.addMapping("ArrowLeft", this.callbackMoveLeft.bind(this));
    Keyboard.addMapping("ArrowRight", this.callbackMoveRight.bind(this));

    Keyboard.addMapping("Space", this.callbackShoot.bind(this));
  }

  private callbackMoveLeft(state: boolean): void {
    this.moveLeft = state;
  }

  private callbackMoveRight(state: boolean): void {
    this.moveRight = state;
  }

  private callbackShoot(state: boolean): void {
    if (state) {
      if (this.currentBullets > 0) {
        this.currentBullets -= 1;
        let bullet = new Bullet(this, this.showDebugCollider);
        bullet.constructorWithAssets();

        bullet.position.set(this.position.x, this.position.y - 8);
        this.parent.addChild(bullet);

        this.bullets.push(bullet);
      }
    }
  }

  public update(framesPassed: number): void {
    if (this.moveLeft) {
      this.position.x -= 1 * framesPassed;
    }

    if (this.moveRight) {
      this.position.x += 1 * framesPassed;
    }

    if (this.position.x < this.PLAYER_LEFT_EDGE) {
      this.position.x = this.PLAYER_LEFT_EDGE;
    }

    if (this.position.x > this.PLAYER_RIGHT_EDGE) {
      this.position.x = this.PLAYER_RIGHT_EDGE;
    }

    this.bullets.forEach((bullet) => {
      bullet.update(framesPassed);
    });

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

  // Remove the keyboard mappings when the player is destroyed, otherwise we'll get errors
  public cleanup(): void {
    Keyboard.removeMapping("KeyA");
    Keyboard.removeMapping("KeyD");
    Keyboard.removeMapping("ArrowLeft");
    Keyboard.removeMapping("ArrowRight");
    Keyboard.removeMapping("Space");
  }

  public removeBullet(bullet: Bullet): void {
    let index = this.bullets.indexOf(bullet);
    if (index > -1) {
      this.bullets.splice(index, 1);
      bullet.destroy(); // Always remember to cleanup after yourself
    }
  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public setInitialBullets(bullets: number): void {
    this.initialBullets = bullets;
  }

  public getCurrentBullets(): number {
    return this.currentBullets;
  }

  reset() {
    this.position.set(Manager.width / 2, Manager.height - 4 - 22);

    this.currentBullets = this.initialBullets;
  }
}
