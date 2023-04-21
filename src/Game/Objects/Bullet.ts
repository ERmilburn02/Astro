import { Container, Graphics, Rectangle, Sprite } from "pixi.js";
import { Player } from "./Player";

export class Bullet extends Container {
  private sprite: Sprite = new Sprite();
  private player: Player; // Used for removing the bullet from the player's list of bullets

  private showDebugCollider: boolean = false;
  private hitAreaDebug: Graphics = new Graphics();

  constructor(player: Player, showDebugCollider: boolean = false) {
    super();

    this.hitArea = new Rectangle(0, 0, 3, 6);

    this.player = player;

    this.pivot.set(1, 3);

    this.showDebugCollider = showDebugCollider;
  }

  constructorWithAssets(): void {
    this.sprite = Sprite.from("Bullet");
    this.addChild(this.sprite);

    if (this.showDebugCollider) {
      this.addChild(this.hitAreaDebug);
    } else {
      this.hitAreaDebug.destroy();
    }
  }

  public update(framesPassed: number): void {
    this.position.y -= 1 * framesPassed;

    // Draw the hit area before checking offscreen
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

    if (this.position.y < -8) {
      this.player.removeBullet(this);
    }
  }
}
