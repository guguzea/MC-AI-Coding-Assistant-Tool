import { world } from "@minecraft/server";
world.afterEvents.playerSpawn.subscribe(() => {
  console.warn("example pack loaded (stable Script API)");
});
