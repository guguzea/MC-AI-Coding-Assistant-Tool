---
title: "org.bukkit.event.player.AsyncPlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/AsyncPlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class AsyncPlayerPreLoginEvent**
`public class AsyncPlayerPreLoginEvent extends Event`
- `@Deprecated(since="1.7.5") public AsyncPlayerPreLoginEvent(@NotNull String name, @NotNull InetAddress ipAddress)`
- `@Deprecated(since="1.20.5") public AsyncPlayerPreLoginEvent(@NotNull String name, @NotNull InetAddress ipAddress, @NotNull UUID uniqueId)`
- `public AsyncPlayerPreLoginEvent(@NotNull String name, @NotNull InetAddress ipAddress, @NotNull UUID uniqueId, boolean transferred)`
- `@NotNull public AsyncPlayerPreLoginEvent.Result getLoginResult()`
- `@Deprecated(since="1.3.2") @NotNull public PlayerPreLoginEvent.Result getResult()`
- `public void setLoginResult(@NotNull AsyncPlayerPreLoginEvent.Result result)`
- `@Deprecated(since="1.3.2") public void setResult(@NotNull PlayerPreLoginEvent.Result result)`
- `@NotNull public String getKickMessage()`
- `public void setKickMessage(@NotNull String message)`
- `public void allow()`
- `public void disallow(@NotNull AsyncPlayerPreLoginEvent.Result result, @NotNull String message)`
- `@Deprecated(since="1.3.2") public void disallow(@NotNull PlayerPreLoginEvent.Result result, @NotNull String message)`
- `@NotNull public String getName()`
- `@NotNull public InetAddress getAddress()`
- `@NotNull public UUID getUniqueId()`
- `public boolean isTransferred()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
