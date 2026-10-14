---
title: "org.bukkit.event.world.AsyncStructureGenerateEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/world/AsyncStructureGenerateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AsyncStructureGenerateEvent**
`@Experimental public class AsyncStructureGenerateEvent extends WorldEvent`
- `@Internal public AsyncStructureGenerateEvent(@NotNull @NotNull World world, boolean async, @NotNull @NotNull AsyncStructureGenerateEvent.Cause cause, @NotNull @NotNull Structure structure, @NotNull @NotNull BoundingBox boundingBox, int chunkX, int chunkZ)`
- `@NotNull public @NotNull AsyncStructureGenerateEvent.Cause getCause()`
- `@NotNull public @NotNull Structure getStructure()`
- `@NotNull public @NotNull BoundingBox getBoundingBox()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `@Nullable public @Nullable BlockTransformer getBlockTransformer(@NotNull @NotNull NamespacedKey key)`
- `public void setBlockTransformer(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull BlockTransformer transformer)`
- `public void removeBlockTransformer(@NotNull @NotNull NamespacedKey key)`
- `public void clearBlockTransformers()`
- `@NotNull public @NotNull @Unmodifiable Map<NamespacedKey, BlockTransformer> getBlockTransformers()`
- `@Nullable public @Nullable EntityTransformer getEntityTransformer(@NotNull @NotNull NamespacedKey key)`
- `public void setEntityTransformer(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull EntityTransformer transformer)`
- `public void removeEntityTransformer(@NotNull @NotNull NamespacedKey key)`
- `public void clearEntityTransformers()`
- `@NotNull public @NotNull @Unmodifiable Map<NamespacedKey, EntityTransformer> getEntityTransformers()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
