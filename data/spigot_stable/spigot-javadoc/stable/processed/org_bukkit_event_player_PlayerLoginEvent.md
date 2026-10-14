---
title: "org.bukkit.event.player.PlayerLoginEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerLoginEvent**
`public class PlayerLoginEvent extends PlayerEvent`
- `public PlayerLoginEvent(@NotNull Player player, @NotNull String hostname, @NotNull InetAddress address, @NotNull InetAddress realAddress)`
- `public PlayerLoginEvent(@NotNull Player player, @NotNull String hostname, @NotNull InetAddress address)`
- `public PlayerLoginEvent(@NotNull Player player, @NotNull String hostname, @NotNull InetAddress address, @NotNull PlayerLoginEvent.Result result, @NotNull String message, @NotNull InetAddress realAddress)`
- `@NotNull public PlayerLoginEvent.Result getResult()`
- `public void setResult(@NotNull PlayerLoginEvent.Result result)`
- `@NotNull public String getKickMessage()`
- `public void setKickMessage(@NotNull String message)`
- `@NotNull public String getHostname()`
- `public void allow()`
- `public void disallow(@NotNull PlayerLoginEvent.Result result, @NotNull String message)`
- `@NotNull public InetAddress getAddress()`
- `@NotNull public InetAddress getRealAddress()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
