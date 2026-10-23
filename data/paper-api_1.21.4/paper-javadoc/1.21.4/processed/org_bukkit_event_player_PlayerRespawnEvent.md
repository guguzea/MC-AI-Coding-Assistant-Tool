---
title: "org.bukkit.event.player.PlayerRespawnEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerRespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(since="1.16.1", forRemoval=true) public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn)`
- `@Deprecated(since="1.19.4", forRemoval=true) public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn)`
- `@Deprecated(forRemoval=true) public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, @NotNull @NotNull PlayerRespawnEvent.RespawnReason respawnReason)`
- `@Internal public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, boolean missingRespawnBlock, @NotNull @NotNull PlayerRespawnEvent.RespawnReason respawnReason, @NotNull ImmutableSet.Builder<PlayerRespawnEvent.RespawnFlag> respawnFlags)`
- `@NotNull public @NotNull Location getRespawnLocation()`
- `public void setRespawnLocation(@NotNull @NotNull Location respawnLocation)`
- `public boolean isBedSpawn()`
- `public boolean isAnchorSpawn()`
- `public boolean isMissingRespawnBlock()`
- `@NotNull public @NotNull PlayerRespawnEvent.RespawnReason getRespawnReason()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public Set<PlayerRespawnEvent.RespawnFlag> getRespawnFlags()`
