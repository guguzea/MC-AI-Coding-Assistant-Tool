---
title: "org.bukkit.event.block.BlockFromToEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockFromToEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockFromToEvent**
`public class BlockFromToEvent extends BlockEvent implements Cancellable`
- `protected Block to`
- `protected BlockFace face`
- `protected boolean cancelled`
- `@Internal public BlockFromToEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockFace face)`
- `@Internal public BlockFromToEvent(@NotNull @NotNull Block block, @NotNull @NotNull Block toBlock)`
- `@NotNull public @NotNull BlockFace getFace()`
- `@NotNull public @NotNull Block getToBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
