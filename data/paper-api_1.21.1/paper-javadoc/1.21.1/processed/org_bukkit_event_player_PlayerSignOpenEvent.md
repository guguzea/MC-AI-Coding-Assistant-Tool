---
title: "org.bukkit.event.player.PlayerSignOpenEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerSignOpenEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public PlayerSignOpenEvent(@NotNull @NotNull Player player, @NotNull @NotNull Sign sign, @NotNull @NotNull Side side, @NotNull @NotNull PlayerSignOpenEvent.Cause cause)`
- `@NotNull public @NotNull Sign getSign()`
- `@NotNull public @NotNull Side getSide()`
- `@NotNull public @NotNull PlayerSignOpenEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
