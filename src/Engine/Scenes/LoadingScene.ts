import { Container, Graphics } from "pixi.js";
import { IScene } from "../IScene";
import { Manager } from "../Manager";

export class LoadingScene extends Container implements IScene {
  assetBundles: string[] = [];

  private spinnerContainer: Container;

  private innerSpinnerContainer: Container;
  private innerSpinner1: Graphics;
  private innerSpinner2: Graphics;

  constructor() {
    super();

    this.spinnerContainer = new Container();
    this.spinnerContainer.x = Manager.width / 2;
    this.spinnerContainer.y = Manager.height / 2;
    this.spinnerContainer.pivot.set(0.5);
    this.spinnerContainer.scale.set(0.5);
    this.addChild(this.spinnerContainer);

    this.innerSpinnerContainer = new Container();
    this.spinnerContainer.addChild(this.innerSpinnerContainer);

    this.innerSpinner1 = new Graphics();
    this.innerSpinner1.lineStyle({ width: 2, color: 0xffffff, alpha: 1 });

    this.innerSpinner2 = new Graphics();
    this.innerSpinner2.lineStyle({ width: 2, color: 0xffffff, alpha: 1 });

    const angle1 = 35 * Math.PI;
    const angle2 = 35 * Math.PI;
    const space = (360 - angle1 - angle2) / 2;
    const startAngle1 = (space * Math.PI) / 180;
    const endAngle1 = ((space + angle1) * Math.PI) / 180;
    const startAngle2 = ((space + angle1 + space) * Math.PI) / 180;
    const endAngle2 = ((space + angle1 + space + angle2) * Math.PI) / 180;

    // Draw first arc
    this.innerSpinner1.arc(0, 0, 20, startAngle1, endAngle1);
    this.innerSpinner1.lineTo(-25, 0);
    this.innerSpinner1.lineTo(-20, -5);
    this.innerSpinner1.lineTo(-15, 0);
    this.innerSpinner1.lineTo(-20, 0);

    // Draw second arc
    this.innerSpinner2.arc(0, 0, 20, startAngle2, endAngle2);
    this.innerSpinner2.lineTo(25, 0);
    this.innerSpinner2.lineTo(20, 5);
    this.innerSpinner2.lineTo(15, 0);
    this.innerSpinner2.lineTo(20, 0);

    this.innerSpinnerContainer.addChild(this.innerSpinner1);
    this.innerSpinnerContainer.addChild(this.innerSpinner2);
  }

  // Unused as this scene never has assets
  constructorWithAssets(): void {}

  update(framesPassed: number): void {
    this.innerSpinnerContainer.rotation += 0.05 * framesPassed;
  }

  // Unused as this scene lasts for the lifetime of the game
  cleanup(): void {}
}
