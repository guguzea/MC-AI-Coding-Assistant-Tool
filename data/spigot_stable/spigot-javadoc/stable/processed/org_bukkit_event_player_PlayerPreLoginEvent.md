---
title: "org.bukkit.event.player.PlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerPreLoginEvent**
`@Deprecated(since="1.3.2") public class PlayerPreLoginEvent extends Event`
- `@Deprecated(since="1.7.5") public PlayerPreLoginEvent(@NotNull String name, @NotNull InetAddress ipAddress)`
- `public PlayerPreLoginEvent(@NotNull String name, @NotNull InetAddress ipAddress, @NotNull UUID uniqueId)`
- `@NotNull public PlayerPreLoginEvent.Result getResult()`
- `public void setResult(@NotNull PlayerPreLoginEvent.Result result)`
- `@NotNull public String getKickMessage()`
- `public void setKickMessage(@NotNull String message)`
- `public void allow()`
- `public void disallow(@NotNull PlayerPreLoginEvent.Result result, @NotNull String message)`
- `@NotNull public String getName()`
- `@NotNull public InetAddress getAddress()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public UUID getUniqueId()`
- `@NotNull public static HandlerList getHandlerList()`
