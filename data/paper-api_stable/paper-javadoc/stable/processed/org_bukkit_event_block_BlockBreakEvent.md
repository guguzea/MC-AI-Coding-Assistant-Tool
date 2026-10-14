---
title: "org.bukkit.event.block.BlockBreakEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockBreakEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockBreakEvent**
`public class BlockBreakEvent extends BlockExpEvent implements Cancellable`
- `@Internal public BlockBreakEvent(@NotNull @NotNull Block block, @NotNull @NotNull Player player)`
- `@NotNull public @NotNull Player getPlayer()`
- `public void setDropItems(boolean dropItems)`
- `public boolean isDropItems()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
