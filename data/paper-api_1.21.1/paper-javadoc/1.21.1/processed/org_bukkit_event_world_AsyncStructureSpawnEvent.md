---
title: "org.bukkit.event.world.AsyncStructureSpawnEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/world/AsyncStructureSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public AsyncStructureSpawnEvent(@NotNull @NotNull World world, @NotNull @NotNull Structure structure, @NotNull @NotNull BoundingBox boundingBox, int chunkX, int chunkZ)`
- `@NotNull public @NotNull Structure getStructure()`
- `@NotNull public @NotNull BoundingBox getBoundingBox()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
