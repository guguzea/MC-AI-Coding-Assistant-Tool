---
title: "org.bukkit.event.player.PlayerLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull InetAddress realAddress)`
- `@Internal public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address)`
- `@Deprecated(forRemoval=true) public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull PlayerLoginEvent.Result result, @NotNull @NotNull String message, @NotNull @NotNull InetAddress realAddress)`
- `@Internal public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull PlayerLoginEvent.Result result, @NotNull Component message, @NotNull @NotNull InetAddress realAddress)`
- `public @NotNull Component kickMessage()`
- `public void kickMessage(@NotNull Component message)`
- `@NotNull public @NotNull PlayerLoginEvent.Result getResult()`
- `public void setResult(@NotNull @NotNull PlayerLoginEvent.Result result)`
- `@NotNull @Deprecated public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage(@NotNull @NotNull String message)`
- `@NotNull public @NotNull String getHostname()`
- `public void allow()`
- `@Deprecated public void disallow(@NotNull @NotNull PlayerLoginEvent.Result result, @NotNull @NotNull String message)`
- `public void disallow(@NotNull @NotNull PlayerLoginEvent.Result result, @NotNull Component message)`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull InetAddress getRealAddress()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
