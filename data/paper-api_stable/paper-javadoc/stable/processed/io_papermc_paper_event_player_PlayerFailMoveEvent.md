---
title: "io.papermc.paper.event.player.PlayerFailMoveEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerFailMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerFailMoveEvent**
`@NullMarked public class PlayerFailMoveEvent extends PlayerEvent`
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
