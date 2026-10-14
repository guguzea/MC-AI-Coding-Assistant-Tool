---
title: "org.bukkit.event.block.BlockExplodeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockExplodeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockExplodeEvent**
`public class BlockExplodeEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockExplodeEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockState blockState, @NotNull @NotNull List<Block> blocks, float yield, @NotNull @NotNull ExplosionResult result)`
- `@NotNull public @NotNull ExplosionResult getExplosionResult()`
- `@NotNull public @NotNull BlockState getExplodedBlockState()`
- `@NotNull public @NotNull List<Block> blockList()`
- `public float getYield()`
- `public void setYield(float yield)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
