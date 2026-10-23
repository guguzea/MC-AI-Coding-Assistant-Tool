---
title: "org.bukkit.event.player.PlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerPreLoginEvent&#8203;(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress)`
- `public PlayerPreLoginEvent&#8203;(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId)`
- `@NotNull public @NotNull PlayerPreLoginEvent.Result getResult()`
- `public void setResult&#8203;(@NotNull @NotNull PlayerPreLoginEvent.Result result)`
- `@NotNull public Component kickMessage()`
- `public void kickMessage&#8203;(@NotNull Component message)`
- `public void disallow&#8203;(@NotNull @NotNull PlayerPreLoginEvent.Result result, @NotNull Component message)`
- `@Deprecated @NotNull public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage&#8203;(@NotNull @NotNull String message)`
- `public void allow()`
- `@Deprecated public void disallow&#8203;(@NotNull @NotNull PlayerPreLoginEvent.Result result, @NotNull @NotNull String message)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public @NotNull UUID getUniqueId()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
