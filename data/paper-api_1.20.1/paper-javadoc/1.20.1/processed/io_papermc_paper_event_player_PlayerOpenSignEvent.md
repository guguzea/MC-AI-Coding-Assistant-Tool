---
title: "io.papermc.paper.event.player.PlayerOpenSignEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerOpenSignEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Internal public PlayerOpenSignEvent(@NotNull @NotNull Player editor, @NotNull @NotNull Sign sign, @NotNull @NotNull Side side, @NotNull @NotNull PlayerOpenSignEvent.Cause cause)`
- `@NotNull public @NotNull Sign getSign()`
- `@NotNull public @NotNull Side getSide()`
- `@NotNull public @NotNull PlayerOpenSignEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
