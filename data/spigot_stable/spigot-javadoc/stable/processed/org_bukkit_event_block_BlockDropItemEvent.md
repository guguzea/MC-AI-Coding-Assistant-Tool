---
title: "org.bukkit.event.block.BlockDropItemEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockDropItemEvent**
`public class BlockDropItemEvent extends BlockEvent implements Cancellable`
- `public BlockDropItemEvent(@NotNull Block block, @NotNull BlockState blockState, @NotNull Player player, @NotNull List<Item> items)`
- `@NotNull public Player getPlayer()`
- `@NotNull public BlockState getBlockState()`
- `@NotNull public List<Item> getItems()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
