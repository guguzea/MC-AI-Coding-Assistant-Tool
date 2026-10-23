---
title: "io.papermc.paper.event.player.PlayerFailMoveEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/player/PlayerFailMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public PlayerFailMoveEvent(Player player, PlayerFailMoveEvent.FailReason failReason, boolean allowed, boolean logWarning, Location from, Location to)`
- `public PlayerFailMoveEvent.FailReason getFailReason()`
- `public Location getFrom()`
- `public Location getTo()`
- `public boolean isAllowed()`
- `public void setAllowed(boolean allowed)`
- `public boolean getLogWarning()`
- `public void setLogWarning(boolean logWarning)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
