import { BaseTexture } from "pixi.js";
import { SCALE_MODES } from "@pixi/constants";
import { Manager } from "./Engine/Manager";
// import { LoadingScene } from "./Engine/Scenes/LoadingScene";
import { GameScene } from "./Game/Scenes/GameScene";
import { Keyboard } from "./Game/Keyboard";

BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

Manager.initialize(119, 141, 0x000000);
Keyboard.registerCallbacks();
Manager.changeScene(new GameScene(false));

// TODO: UI
// TODO: Lose Life
// TODO: Game Over
// TODO: Move sprites to atlas
