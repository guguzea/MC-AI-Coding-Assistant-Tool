---
title: "org.bukkit.event.block.BlockFromToEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockFromToEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockFromToEvent**
`public class BlockFromToEvent extends BlockEvent implements Cancellable`
- `protected Block to`
- `protected BlockFace face`
- `protected boolean cancel`
- `public BlockFromToEvent(@NotNull Block block, @NotNull BlockFace face)`
- `public BlockFromToEvent(@NotNull Block block, @NotNull Block toBlock)`
- `@NotNull public BlockFace getFace()`
- `@NotNull public Block getToBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
