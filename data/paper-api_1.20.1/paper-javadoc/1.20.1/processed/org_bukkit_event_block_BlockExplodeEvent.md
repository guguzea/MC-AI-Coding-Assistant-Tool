---
title: "org.bukkit.event.block.BlockExplodeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/block/BlockExplodeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public BlockExplodeEvent(@NotNull @NotNull Block what, @NotNull @NotNull List<Block> blocks, float yield)`
- `@Internal public BlockExplodeEvent(@NotNull @NotNull Block what, @NotNull @NotNull List<Block> blocks, float yield, @Nullable BlockState explodedBlockState)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@Nullable public BlockState getExplodedBlockState()`
- `@NotNull public @NotNull List<Block> blockList()`
- `public float getYield()`
- `public void setYield(float yield)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
