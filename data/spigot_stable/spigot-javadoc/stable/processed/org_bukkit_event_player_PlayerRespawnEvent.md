---
title: "org.bukkit.event.player.PlayerRespawnEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerRespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerRespawnEvent**
`public class PlayerRespawnEvent extends PlayerEvent`
- `@Deprecated(since="1.16.1") public PlayerRespawnEvent(@NotNull Player respawnPlayer, @NotNull Location respawnLocation, boolean isBedSpawn)`
- `@Deprecated(since="1.19.4") public PlayerRespawnEvent(@NotNull Player respawnPlayer, @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn)`
- `public PlayerRespawnEvent(@NotNull Player respawnPlayer, @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, @NotNull PlayerRespawnEvent.RespawnReason respawnReason)`
- `@NotNull public Location getRespawnLocation()`
- `public void setRespawnLocation(@NotNull Location respawnLocation)`
- `public boolean isBedSpawn()`
- `public boolean isAnchorSpawn()`
- `@NotNull public PlayerRespawnEvent.RespawnReason getRespawnReason()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
