---
title: "org.bukkit.event.world.AsyncStructureSpawnEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/world/AsyncStructureSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AsyncStructureSpawnEvent**
`public class AsyncStructureSpawnEvent extends WorldEvent implements Cancellable`
- `@Internal public AsyncStructureSpawnEvent(@NotNull @NotNull World world, @NotNull @NotNull Structure structure, @NotNull @NotNull BoundingBox boundingBox, int chunkX, int chunkZ)`
- `@NotNull public @NotNull Structure getStructure()`
- `@NotNull public @NotNull BoundingBox getBoundingBox()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
