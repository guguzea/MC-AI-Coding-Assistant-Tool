---
title: "io.papermc.paper.event.block.BlockPreDispenseEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/block/BlockPreDispenseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockPreDispenseEvent**
`@NullMarked public class BlockPreDispenseEvent extends BlockEvent implements Cancellable`
- `@Internal public BlockPreDispenseEvent(Block block, ItemStack itemStack, int slot)`
- `public ItemStack getItemStack()`
- `public int getSlot()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
