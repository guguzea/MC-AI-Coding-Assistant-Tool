---
title: "org.bukkit.event.block.BlockBrushEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockBrushEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockBrushEvent**
`@Experimental public class BlockBrushEvent extends BlockEvent implements Cancellable`
- `public BlockBrushEvent(@NotNull Block theBlock, @NotNull BlockState newState, @NotNull Player player)`
- `@NotNull public Player getPlayer()`
- `@NotNull public BlockState getNewState()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
