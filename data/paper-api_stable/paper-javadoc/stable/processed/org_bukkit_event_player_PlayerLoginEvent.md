---
title: "org.bukkit.event.player.PlayerLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerLoginEvent**
`@Deprecated(since="1.21.6") public class PlayerLoginEvent extends PlayerEvent`
- `@Internal public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull InetAddress realAddress)`
- `@Internal public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address)`
- `@Internal @Deprecated(forRemoval=true) public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull PlayerLoginEvent.Result result, @NotNull @NotNull String message, @NotNull @NotNull InetAddress realAddress)`
- `@Internal public PlayerLoginEvent(@NotNull @NotNull Player player, @NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull PlayerLoginEvent.Result result, @NotNull Component message, @NotNull @NotNull InetAddress realAddress)`
- `@NotNull public @NotNull String getHostname()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull InetAddress getRealAddress()`
- `@NotNull public @NotNull PlayerLoginEvent.Result getResult()`
- `public void setResult(@NotNull @NotNull PlayerLoginEvent.Result result)`
- `@NotNull public @NotNull Component kickMessage()`
- `public void kickMessage(@NotNull @NotNull Component message)`
- `@NotNull @Deprecated public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage(@NotNull @NotNull String message)`
- `public void allow()`
- `@Deprecated public void disallow(@NotNull @NotNull PlayerLoginEvent.Result result, @NotNull @NotNull String message)`
- `public void disallow(@NotNull @NotNull PlayerLoginEvent.Result result, @NotNull @NotNull Component message)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
