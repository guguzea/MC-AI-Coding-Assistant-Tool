---
title: "com.destroystokyo.paper.event.block.BlockDestroyEvent"
package: "com.destroystokyo.paper.event.block"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/block/BlockDestroyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public BlockDestroyEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockData newState, boolean willDrop)`
- `@NotNull public @NotNull BlockData getNewState()`
- `public boolean willDrop()`
- `public void setWillDrop(boolean willDrop)`
- `public boolean playEffect()`
- `public void setPlayEffect(boolean playEffect)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
