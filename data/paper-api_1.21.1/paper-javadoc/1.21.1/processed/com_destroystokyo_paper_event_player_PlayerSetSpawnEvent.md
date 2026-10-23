---
title: "com.destroystokyo.paper.event.player.PlayerSetSpawnEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.21.1/com/destroystokyo/paper/event/player/PlayerSetSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public PlayerSetSpawnEvent(Player player, PlayerSetSpawnEvent.Cause cause, @Nullable Location location, boolean forced, boolean notifyPlayer, @Nullable Component notification)`
- `public PlayerSetSpawnEvent.Cause getCause()`
- `public @Nullable Location getLocation()`
- `public void setLocation(@Nullable Location location)`
- `public boolean isForced()`
- `public void setForced(boolean forced)`
- `public boolean willNotifyPlayer()`
- `public void setNotifyPlayer(boolean notifyPlayer)`
- `public @Nullable Component getNotification()`
- `public void setNotification(@Nullable Component notification)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
