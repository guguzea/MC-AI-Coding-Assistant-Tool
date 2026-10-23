---
title: "org.bukkit.event.block.BlockPhysicsEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/BlockPhysicsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public BlockPhysicsEvent&#8203;(Block block, BlockData changed, int sourceX, int sourceY, int sourceZ)`
- `public BlockPhysicsEvent&#8203;(@NotNull @NotNull Block block, @NotNull @NotNull BlockData changed)`
- `public BlockPhysicsEvent&#8203;(@NotNull @NotNull Block block, @NotNull @NotNull BlockData changed, @NotNull @NotNull Block sourceBlock)`
- `@NotNull public @NotNull Block getSourceBlock()`
- `@NotNull public @NotNull Material getChangedType()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
