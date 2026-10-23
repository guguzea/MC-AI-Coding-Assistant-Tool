---
title: "org.bukkit.event.player.AsyncPlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/AsyncPlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(since="1.7.5", forRemoval=true) public AsyncPlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress)`
- `@Deprecated(since="1.20.5", forRemoval=true) public AsyncPlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId)`
- `@Internal public AsyncPlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId, boolean transferred)`
- `@Deprecated(forRemoval=true) public AsyncPlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId, boolean transferred, @NotNull PlayerProfile profile)`
- `@Deprecated(forRemoval=true) public AsyncPlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull InetAddress rawAddress, @NotNull @NotNull UUID uniqueId, boolean transferred, @NotNull PlayerProfile profile)`
- `@Internal public AsyncPlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull InetAddress rawAddress, @NotNull @NotNull UUID uniqueId, boolean transferred, @NotNull PlayerProfile profile, @NotNull @NotNull String hostname)`
- `@NotNull public @NotNull AsyncPlayerPreLoginEvent.Result getLoginResult()`
- `@Deprecated(since="1.3.2") @NotNull public PlayerPreLoginEvent.Result getResult()`
- `public void setLoginResult(@NotNull @NotNull AsyncPlayerPreLoginEvent.Result result)`
- `@Deprecated(since="1.3.2") public void setResult(@NotNull PlayerPreLoginEvent.Result result)`
- `@NotNull public Component kickMessage()`
- `public void kickMessage(@NotNull Component message)`
- `public void disallow(@NotNull @NotNull AsyncPlayerPreLoginEvent.Result result, @NotNull Component message)`
- `@Deprecated public void disallow(@NotNull PlayerPreLoginEvent.Result result, @NotNull Component message)`
- `@NotNull @Deprecated public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage(@NotNull @NotNull String message)`
- `public void allow()`
- `@Deprecated public void disallow(@NotNull @NotNull AsyncPlayerPreLoginEvent.Result result, @NotNull @NotNull String message)`
- `@Deprecated(since="1.3.2") public void disallow(@NotNull PlayerPreLoginEvent.Result result, @NotNull @NotNull String message)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull UUID getUniqueId()`
- `@NotNull public PlayerProfile getPlayerProfile()`
- `public void setPlayerProfile(@NotNull PlayerProfile profile)`
- `@NotNull public @NotNull InetAddress getRawAddress()`
- `@NotNull public @NotNull String getHostname()`
- `public boolean isTransferred()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
