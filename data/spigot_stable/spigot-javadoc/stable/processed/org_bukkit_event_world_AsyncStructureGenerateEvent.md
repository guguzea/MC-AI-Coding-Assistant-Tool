---
title: "org.bukkit.event.world.AsyncStructureGenerateEvent"
package: "org.bukkit.event.world"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/world/AsyncStructureGenerateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class AsyncStructureGenerateEvent**
`@Experimental public class AsyncStructureGenerateEvent extends WorldEvent`
- `public AsyncStructureGenerateEvent(@NotNull World world, boolean async, @NotNull AsyncStructureGenerateEvent.Cause cause, @NotNull Structure structure, @NotNull BoundingBox boundingBox, int chunkX, int chunkZ)`
- `@NotNull public AsyncStructureGenerateEvent.Cause getCause()`
- `@Nullable public BlockTransformer getBlockTransformer(@NotNull NamespacedKey key)`
- `public void setBlockTransformer(@NotNull NamespacedKey key, @NotNull BlockTransformer transformer)`
- `public void removeBlockTransformer(@NotNull NamespacedKey key)`
- `public void clearBlockTransformers()`
- `@NotNull public Map<NamespacedKey, BlockTransformer> getBlockTransformers()`
- `@Nullable public EntityTransformer getEntityTransformer(@NotNull NamespacedKey key)`
- `public void setEntityTransformer(@NotNull NamespacedKey key, @NotNull EntityTransformer transformer)`
- `public void removeEntityTransformer(@NotNull NamespacedKey key)`
- `public void clearEntityTransformers()`
- `@NotNull public Map<NamespacedKey, EntityTransformer> getEntityTransformers()`
- `@NotNull public Structure getStructure()`
- `@NotNull public BoundingBox getBoundingBox()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
