---
title: "io.papermc.paper.event.player.PlayerPickItemEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/player/PlayerPickItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public PlayerPickItemEvent(Player player, int targetSlot, int sourceSlot)`
- `public @org.jetbrains.annotations.Range(from=0L, to=8L) int getTargetSlot()`
- `public void setTargetSlot(@org.jetbrains.annotations.Range(from=0L, to=8L) int targetSlot)`
- `public @org.jetbrains.annotations.Range(from=-1L, to=35L) int getSourceSlot()`
- `public void setSourceSlot(@org.jetbrains.annotations.Range(from=-1L, to=35L) int sourceSlot)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
