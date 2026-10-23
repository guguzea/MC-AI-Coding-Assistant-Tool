---
title: "org.bukkit.event.block.BlockExplodeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/block/BlockExplodeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public BlockExplodeEvent(@NotNull @NotNull Block what, @NotNull @NotNull BlockState blockState, @NotNull @NotNull List<Block> blocks, float yield, @NotNull @NotNull ExplosionResult result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull ExplosionResult getExplosionResult()`
- `@NotNull public @NotNull BlockState getExplodedBlockState()`
- `@NotNull public @NotNull List<Block> blockList()`
- `public float getYield()`
- `public void setYield(float yield)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
