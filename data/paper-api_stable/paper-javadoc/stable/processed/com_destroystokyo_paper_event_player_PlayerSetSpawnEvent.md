---
title: "com.destroystokyo.paper.event.player.PlayerSetSpawnEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerSetSpawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerSetSpawnEvent**
`@NullMarked public class PlayerSetSpawnEvent extends PlayerEvent implements Cancellable`
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
