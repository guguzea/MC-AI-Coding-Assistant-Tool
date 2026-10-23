---
title: "org.bukkit.event.block.BlockPhysicsEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/block/BlockPhysicsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public BlockPhysicsEvent(Block block, BlockData changed, int sourceX, int sourceY, int sourceZ)`
- `public BlockPhysicsEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockData changed)`
- `public BlockPhysicsEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockData changed, @NotNull @NotNull Block sourceBlock)`
- `@NotNull public @NotNull Block getSourceBlock()`
- `@NotNull public @NotNull Material getChangedType()`
- `@NotNull public @NotNull BlockData getChangedBlockData()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
