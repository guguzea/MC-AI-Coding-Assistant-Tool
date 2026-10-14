---
title: "org.bukkit.event.block.BlockPistonEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockPistonEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockPistonEvent**
`public abstract class BlockPistonEvent extends BlockEvent implements Cancellable`
- `protected BlockPistonEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockFace direction)`
- `public boolean isSticky()`
- `@NotNull public @NotNull BlockFace getDirection()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
