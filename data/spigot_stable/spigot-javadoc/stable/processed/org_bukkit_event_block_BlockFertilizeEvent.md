---
title: "org.bukkit.event.block.BlockFertilizeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockFertilizeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockFertilizeEvent**
`public class BlockFertilizeEvent extends BlockEvent implements Cancellable`
- `public BlockFertilizeEvent(@NotNull Block theBlock, @Nullable Player player, @NotNull List<BlockState> blocks)`
- `@Nullable public Player getPlayer()`
- `@NotNull public List<BlockState> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
