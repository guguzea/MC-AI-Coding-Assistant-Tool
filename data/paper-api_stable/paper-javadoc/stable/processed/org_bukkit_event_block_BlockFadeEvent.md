---
title: "org.bukkit.event.block.BlockFadeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockFadeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockFadeEvent**
`public class BlockFadeEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockFadeEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockState newState)`
- `@NotNull public @NotNull BlockState getNewState()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
