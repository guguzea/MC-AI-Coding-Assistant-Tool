---
title: "org.bukkit.event.player.PlayerLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerLoginEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull InetAddress realAddress)`
- `public PlayerLoginEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address)`
- `@Deprecated public PlayerLoginEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull PlayerLoginEvent.Result result, @NotNull @NotNull String message, @NotNull @NotNull InetAddress realAddress)`
- `public PlayerLoginEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull PlayerLoginEvent.Result result, @NotNull Component message, @NotNull @NotNull InetAddress realAddress)`
- `@NotNull public Component kickMessage()`
- `public void kickMessage&#8203;(@NotNull Component message)`
- `@NotNull public @NotNull InetAddress getRealAddress()`
- `@NotNull public @NotNull PlayerLoginEvent.Result getResult()`
- `public void setResult&#8203;(@NotNull @NotNull PlayerLoginEvent.Result result)`
- `@NotNull @Deprecated public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage&#8203;(@NotNull @NotNull String message)`
- `@NotNull public @NotNull String getHostname()`
- `public void allow()`
- `@Deprecated public void disallow&#8203;(@NotNull @NotNull PlayerLoginEvent.Result result, @NotNull @NotNull String message)`
- `public void disallow&#8203;(@NotNull @NotNull PlayerLoginEvent.Result result, @NotNull Component message)`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
