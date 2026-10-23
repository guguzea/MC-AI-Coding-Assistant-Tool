---
title: "org.bukkit.event.block.BlockDropItemEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/BlockDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public BlockDropItemEvent&#8203;(@NotNull @NotNull Block block, @NotNull @NotNull BlockState blockState, @NotNull @NotNull Player player, @NotNull @NotNull List<Item> items)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull BlockState getBlockState()`
- `@NotNull public @NotNull List<Item> getItems()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
