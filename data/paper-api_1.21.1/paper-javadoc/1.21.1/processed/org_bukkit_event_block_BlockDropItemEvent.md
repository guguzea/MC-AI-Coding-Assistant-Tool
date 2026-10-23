---
title: "org.bukkit.event.block.BlockDropItemEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/block/BlockDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public BlockDropItemEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockState blockState, @NotNull @NotNull Player player, @NotNull @NotNull List<Item> items)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull BlockState getBlockState()`
- `@NotNull public @NotNull List<Item> getItems()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
