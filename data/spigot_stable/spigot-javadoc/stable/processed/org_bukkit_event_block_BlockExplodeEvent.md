---
title: "org.bukkit.event.block.BlockExplodeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockExplodeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockExplodeEvent**
`public class BlockExplodeEvent extends BlockEvent implements Cancellable`
- `public BlockExplodeEvent(@NotNull Block what, @NotNull BlockState blockState, @NotNull List<Block> blocks, float yield, @NotNull ExplosionResult result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public ExplosionResult getExplosionResult()`
- `@NotNull public BlockState getExplodedBlockState()`
- `@NotNull public List<Block> blockList()`
- `public float getYield()`
- `public void setYield(float yield)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
