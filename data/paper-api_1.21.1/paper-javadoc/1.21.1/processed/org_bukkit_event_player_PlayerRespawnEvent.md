---
title: "org.bukkit.event.player.PlayerRespawnEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerRespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn)`
- `@Deprecated public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn)`
- `@Deprecated public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, @NotNull @NotNull PlayerRespawnEvent.RespawnReason respawnReason)`
- `public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, @NotNull @NotNull PlayerRespawnEvent.RespawnReason respawnReason, @NotNull ImmutableSet.Builder<PlayerRespawnEvent.RespawnFlag> respawnFlags)`
- `@NotNull public @NotNull Location getRespawnLocation()`
- `public void setRespawnLocation(@NotNull @NotNull Location respawnLocation)`
- `public boolean isBedSpawn()`
- `public boolean isAnchorSpawn()`
- `@NotNull public @NotNull PlayerRespawnEvent.RespawnReason getRespawnReason()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public Set<PlayerRespawnEvent.RespawnFlag> getRespawnFlags()`
