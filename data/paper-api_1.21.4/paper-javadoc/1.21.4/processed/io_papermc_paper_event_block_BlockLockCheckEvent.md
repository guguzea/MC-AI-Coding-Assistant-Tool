---
title: "io.papermc.paper.event.block.BlockLockCheckEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/block/BlockLockCheckEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public BlockLockCheckEvent(Block block, Player player, Component lockedMessage, Sound lockedSound)`
- `public LockableTileState getBlockState()`
- `public Player getPlayer()`
- `public ItemStack getKeyItem()`
- `public void setKeyItem(ItemStack stack)`
- `public void resetKeyItem()`
- `public boolean isUsingCustomKeyItemStack()`
- `public Event.Result getResult()`
- `public void setResult(Event.Result result)`
- `public void denyWithMessageAndSound(@Nullable Component lockedMessage, @Nullable Sound lockedSound)`
- `public @Nullable Component getLockedMessage()`
- `public void setLockedMessage(@Nullable Component lockedMessage)`
- `public @Nullable Sound getLockedSound()`
- `public void setLockedSound(@Nullable Sound lockedSound)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
