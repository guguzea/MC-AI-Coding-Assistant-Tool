---
title: "org.bukkit.event.world.AsyncStructureSpawnEvent"
package: "org.bukkit.event.world"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/world/AsyncStructureSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class AsyncStructureSpawnEvent**
`public class AsyncStructureSpawnEvent extends WorldEvent implements Cancellable`
- `public AsyncStructureSpawnEvent(@NotNull World world, @NotNull Structure structure, @NotNull BoundingBox boundingBox, int chunkX, int chunkZ)`
- `@NotNull public Structure getStructure()`
- `@NotNull public BoundingBox getBoundingBox()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
