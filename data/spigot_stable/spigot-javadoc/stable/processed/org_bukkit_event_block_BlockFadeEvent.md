---
title: "org.bukkit.event.block.BlockFadeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockFadeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockFadeEvent**
`public class BlockFadeEvent extends BlockEvent implements Cancellable`
- `public BlockFadeEvent(@NotNull Block block, @NotNull BlockState newState)`
- `@NotNull public BlockState getNewState()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
