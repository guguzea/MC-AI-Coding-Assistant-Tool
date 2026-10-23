---
title: "org.bukkit.event.player.PlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress)`
- `public PlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId)`
- `@NotNull public @NotNull PlayerPreLoginEvent.Result getResult()`
- `public void setResult(@NotNull @NotNull PlayerPreLoginEvent.Result result)`
- `@NotNull public Component kickMessage()`
- `public void kickMessage(@NotNull Component message)`
- `public void disallow(@NotNull @NotNull PlayerPreLoginEvent.Result result, @NotNull Component message)`
- `@Deprecated @NotNull public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage(@NotNull @NotNull String message)`
- `public void allow()`
- `@Deprecated public void disallow(@NotNull @NotNull PlayerPreLoginEvent.Result result, @NotNull @NotNull String message)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public @NotNull UUID getUniqueId()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
