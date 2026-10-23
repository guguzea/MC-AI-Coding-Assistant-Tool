---
title: "org.bukkit.event.block.BlockFromToEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/block/BlockFromToEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `protected Block to`
- `protected BlockFace face`
- `protected boolean cancel`
- `public BlockFromToEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockFace face)`
- `public BlockFromToEvent(@NotNull @NotNull Block block, @NotNull @NotNull Block toBlock)`
- `@NotNull public @NotNull BlockFace getFace()`
- `@NotNull public @NotNull Block getToBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
