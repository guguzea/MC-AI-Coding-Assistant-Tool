---
title: "org.bukkit.event.block.BlockRedstoneEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/BlockRedstoneEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockRedstoneEvent**
`@NullMarked public class BlockRedstoneEvent extends BlockEvent`
- `@Internal public BlockRedstoneEvent(Block block, int oldCurrent, int newCurrent)`
- `public @IntRange(from=0L,to=15L) int getOldCurrent()`
- `public @IntRange(from=0L,to=15L) int getNewCurrent()`
- `public void setNewCurrent(@IntRange(from=0L,to=15L) int newCurrent)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
