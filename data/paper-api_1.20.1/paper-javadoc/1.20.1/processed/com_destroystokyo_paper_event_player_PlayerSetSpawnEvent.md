---
title: "com.destroystokyo.paper.event.player.PlayerSetSpawnEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/player/PlayerSetSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerSetSpawnEvent(@NotNull @NotNull Player who, @NotNull @NotNull PlayerSetSpawnEvent.Cause cause, @Nullable @Nullable Location location, boolean forced, boolean notifyPlayer, @Nullable @Nullable Component notification)`
- `@NotNull public @NotNull PlayerSetSpawnEvent.Cause getCause()`
- `@Nullable public @Nullable Location getLocation()`
- `public void setLocation(@Nullable @Nullable Location location)`
- `public boolean isForced()`
- `public void setForced(boolean forced)`
- `public boolean willNotifyPlayer()`
- `public void setNotifyPlayer(boolean notifyPlayer)`
- `@Nullable public @Nullable Component getNotification()`
- `public void setNotification(@Nullable @Nullable Component notification)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
