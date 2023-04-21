import type { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
  bundles: [
    {
      name: "game",
      assets: {
        // Spritesheet
        sprites: "data/Sprites.json",
      },
    },
  ],
};

/*
{
        // UI
        Frame: "img/Frame.png",
        Bullet_UI: "img/Bullet-UI.png",
        // Blaster
        Blaster: "img/Blaster.png",
        Blaster_Destroyed: "img/Blaster-Destroyed.png",
        // Bullet
        Bullet: "img/Bullet.png",
        // Target
        Target: "img/Target.png",
        Target_Hit: "img/Target-Hit.png",
        Target_Life: "img/Target-Life.png",
        Target_Double: "img/Target-Double.png",
        // Small Target
        Target_Small: "img/Target-Small.png",
        Target_Small_Hit: "img/Target-Small-Hit.png",
        Target_Small_Life: "img/Target-Small-Life.png",
        Target_Small_Double: "img/Target-Small-Double.png",
        // Wide Target
        Target_Wide: "img/Target-Wide.png",
        Target_Wide_Hit: "img/Target-Wide-Hit.png",
        Target_Wide_Life: "img/Target-Wide-Life.png",
        Target_Wide_Double: "img/Target-Wide-Double.png",
        // Grow Target
        Target_Grow: "img/Target-Grow.png",
        Target_Grow_Hit: "img/Target-Grow-Hit.png",
      }
*/
