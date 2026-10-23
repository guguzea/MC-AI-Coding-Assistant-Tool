---
title: "org.bukkit.event.player.AsyncPlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/AsyncPlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public AsyncPlayerPreLoginEvent&#8203;(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress)`
- `public AsyncPlayerPreLoginEvent&#8203;(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId)`
- `@Deprecated public AsyncPlayerPreLoginEvent&#8203;(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId, @NotNull @NotNull PlayerProfile profile)`
- `public AsyncPlayerPreLoginEvent&#8203;(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull InetAddress rawAddress, @NotNull @NotNull UUID uniqueId, @NotNull @NotNull PlayerProfile profile)`
- `@NotNull public @NotNull PlayerProfile getPlayerProfile()`
- `public void setPlayerProfile&#8203;(@NotNull @NotNull PlayerProfile profile)`
- `@NotNull public @NotNull InetAddress getRawAddress()`
- `@NotNull public @NotNull AsyncPlayerPreLoginEvent.Result getLoginResult()`
- `@Deprecated @NotNull public PlayerPreLoginEvent.Result getResult()`
- `public void setLoginResult&#8203;(@NotNull @NotNull AsyncPlayerPreLoginEvent.Result result)`
- `@Deprecated public void setResult&#8203;(@NotNull PlayerPreLoginEvent.Result result)`
- `@NotNull public Component kickMessage()`
- `public void kickMessage&#8203;(@NotNull Component message)`
- `public void disallow&#8203;(@NotNull @NotNull AsyncPlayerPreLoginEvent.Result result, @NotNull Component message)`
- `@Deprecated public void disallow&#8203;(@NotNull PlayerPreLoginEvent.Result result, @NotNull Component message)`
- `@NotNull @Deprecated public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage&#8203;(@NotNull @NotNull String message)`
- `public void allow()`
- `@Deprecated public void disallow&#8203;(@NotNull @NotNull AsyncPlayerPreLoginEvent.Result result, @NotNull @NotNull String message)`
- `@Deprecated public void disallow&#8203;(@NotNull PlayerPreLoginEvent.Result result, @NotNull @NotNull String message)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull UUID getUniqueId()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
