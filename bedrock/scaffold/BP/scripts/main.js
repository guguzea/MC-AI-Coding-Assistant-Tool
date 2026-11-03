import { world } from "@minecraft/server";

world.afterEvents.worldLoad.subscribe(() => {
  console.log("[scaffold] world loaded");
});

world.afterEvents.playerSpawn.subscribe(() => {
  console.warn("example pack loaded (stable Script API)");
});
