---
title: "org.bukkit.event.player.PlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerPreLoginEvent**
`@Deprecated(since="1.3.2") public class PlayerPreLoginEvent extends Event`
- `@Internal @Deprecated(since="1.7.5", forRemoval=true) public PlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress)`
- `@Internal public PlayerPreLoginEvent(@NotNull @NotNull String name, @NotNull @NotNull InetAddress ipAddress, @NotNull @NotNull UUID uniqueId)`
- `@NotNull public @NotNull PlayerPreLoginEvent.Result getResult()`
- `public void setResult(@NotNull @NotNull PlayerPreLoginEvent.Result result)`
- `@NotNull public @NotNull Component kickMessage()`
- `public void kickMessage(@NotNull @NotNull Component message)`
- `public void disallow(@NotNull @NotNull PlayerPreLoginEvent.Result result, @NotNull @NotNull Component message)`
- `@Deprecated @NotNull public @NotNull String getKickMessage()`
- `@Deprecated public void setKickMessage(@NotNull @NotNull String message)`
- `public void allow()`
- `@Deprecated public void disallow(@NotNull @NotNull PlayerPreLoginEvent.Result result, @NotNull @NotNull String message)`
- `@NotNull public @NotNull String getName()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull public @NotNull UUID getUniqueId()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
