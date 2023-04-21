import { Application, Assets } from "pixi.js";
import { manifest } from "../assets";
import { IScene } from "./IScene";
import { LoadingScene } from "./Scenes/LoadingScene";

export class Manager {
  private constructor() {}

  private static app: Application;
  private static currentScene: IScene;
  private static loadingScene: IScene;

  private static initializeAssetsPromise: Promise<unknown>;

  private static _width: number;
  private static _height: number;

  public static get width(): number {
    return Manager._width;
  }

  public static get height(): number {
    return Manager._height;
  }

  public static initialize(
    width: number,
    height: number,
    background: number
  ): void {
    Manager._width = width;
    Manager._height = height;

    Manager.app = new Application({
      view: document.getElementById("game-canvas") as HTMLCanvasElement,
      resolution: 1,
      autoDensity: true,
      backgroundColor: background,
      width: width,
      height: height,
    });

    Manager.loadingScene = new LoadingScene();

    Manager.initializeAssetsPromise = Assets.init({ manifest: manifest });
    const bundleNames = manifest.bundles.map((b) => b.name);
    Manager.initializeAssetsPromise.then(() =>
      Assets.backgroundLoadBundle(bundleNames)
    );

    Manager.app.ticker.add(Manager.update);

    window.addEventListener("resize", Manager.resize);

    Manager.resize();
  }

  public static resize(): void {
    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    const scale = Math.min(
      screenWidth / Manager.width,
      screenHeight / Manager.height
    );

    const enlargedWidth = Math.floor(scale * Manager.width);
    const enlargedHeight = Math.floor(scale * Manager.height);

    const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    const verticalMargin = (screenHeight - enlargedHeight) / 2;

    const view = Manager.app.view as HTMLCanvasElement;

    view.style.width = `${enlargedWidth}px`;
    view.style.height = `${enlargedHeight}px`;
    view.style.marginLeft = view.style.marginRight = `${horizontalMargin}px`;
    view.style.marginTop = view.style.marginBottom = `${verticalMargin}px`;
  }

  public static async changeScene(newScene: IScene): Promise<void> {
    Manager.app.stage.addChild(this.loadingScene);

    await Manager.initializeAssetsPromise;

    if (Manager.currentScene) {
      Manager.app.stage.removeChild(Manager.currentScene);
      Manager.currentScene.cleanup();
      Manager.currentScene.destroy();
    }

    await Assets.loadBundle(newScene.assetBundles);

    newScene.constructorWithAssets();

    Manager.currentScene = newScene;
    Manager.app.stage.addChild(Manager.currentScene);

    Manager.app.stage.removeChild(this.loadingScene);
  }

  private static update(framesPassed: number): void {
    if (Manager.loadingScene) {
      Manager.loadingScene.update(framesPassed);
    }

    if (Manager.currentScene) {
      Manager.currentScene.update(framesPassed);
    }
  }
}
