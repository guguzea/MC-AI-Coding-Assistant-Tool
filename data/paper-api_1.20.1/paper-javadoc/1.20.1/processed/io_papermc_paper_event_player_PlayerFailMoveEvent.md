---
title: "io.papermc.paper.event.player.PlayerFailMoveEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerFailMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerFailMoveEvent(@NotNull @NotNull Player who, @NotNull @NotNull PlayerFailMoveEvent.FailReason failReason, boolean allowed, boolean logWarning, @NotNull @NotNull Location from, @NotNull @NotNull Location to)`
- `@NotNull public @NotNull PlayerFailMoveEvent.FailReason getFailReason()`
- `@NotNull public @NotNull Location getFrom()`
- `@NotNull public @NotNull Location getTo()`
- `public boolean isAllowed()`
- `public void setAllowed(boolean allowed)`
- `public boolean getLogWarning()`
- `public void setLogWarning(boolean logWarning)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
