---
title: "com.destroystokyo.paper.event.block.BlockDestroyEvent"
package: "com.destroystokyo.paper.event.block"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/block/BlockDestroyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BlockDestroyEvent**
`@NullMarked public class BlockDestroyEvent extends BlockExpEvent implements Cancellable`
- `@Internal public BlockDestroyEvent(Block block, BlockData newState, BlockData effectBlock, int xp, boolean willDrop)`
- `public BlockData getEffectBlock()`
- `public void setEffectBlock(BlockData effectBlock)`
- `public BlockData getNewState()`
- `public boolean willDrop()`
- `public void setWillDrop(boolean willDrop)`
- `public boolean playEffect()`
- `public void setPlayEffect(boolean playEffect)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
