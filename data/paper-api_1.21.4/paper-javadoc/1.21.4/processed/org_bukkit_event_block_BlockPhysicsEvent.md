---
title: "org.bukkit.event.block.BlockPhysicsEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/block/BlockPhysicsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public BlockPhysicsEvent(Block block, BlockData changed, int sourceX, int sourceY, int sourceZ)`
- `@Internal public BlockPhysicsEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockData changed)`
- `@Internal public BlockPhysicsEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockData changed, @NotNull @NotNull Block sourceBlock)`
- `@NotNull public @NotNull Block getSourceBlock()`
- `@NotNull public @NotNull Material getChangedType()`
- `@NotNull public @NotNull BlockData getChangedBlockData()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
