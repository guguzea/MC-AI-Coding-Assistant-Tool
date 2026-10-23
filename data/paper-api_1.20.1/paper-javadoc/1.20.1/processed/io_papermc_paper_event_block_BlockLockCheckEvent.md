---
title: "io.papermc.paper.event.block.BlockLockCheckEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/block/BlockLockCheckEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public BlockLockCheckEvent(@NotNull @NotNull Block block, @NotNull @NotNull LockableTileState state, @NotNull @NotNull Player player, @NotNull @NotNull Component lockedMessage, @NotNull @NotNull Sound lockedSound)`
- `@NotNull public @NotNull LockableTileState getBlockState()`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public @NotNull ItemStack getKeyItem()`
- `public void setKeyItem(@NotNull @NotNull ItemStack stack)`
- `public void resetKeyItem()`
- `public boolean isUsingCustomKeyItemStack()`
- `@NotNull public @NotNull Event.Result getResult()`
- `public void setResult(@NotNull @NotNull Event.Result result)`
- `public void denyWithMessageAndSound(@Nullable @Nullable Component lockedMessage, @Nullable @Nullable Sound lockedSound)`
- `@Nullable public @Nullable Component getLockedMessage()`
- `public void setLockedMessage(@Nullable @Nullable Component lockedMessage)`
- `@Nullable public @Nullable Sound getLockedSound()`
- `public void setLockedSound(@Nullable @Nullable Sound lockedSound)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
