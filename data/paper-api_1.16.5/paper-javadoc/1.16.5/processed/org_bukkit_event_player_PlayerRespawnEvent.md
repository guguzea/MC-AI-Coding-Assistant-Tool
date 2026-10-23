---
title: "org.bukkit.event.player.PlayerRespawnEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerRespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerRespawnEvent&#8203;(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn)`
- `@Deprecated public PlayerRespawnEvent&#8203;(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn)`
- `public PlayerRespawnEvent&#8203;(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, @NotNull ImmutableSet.Builder<PlayerRespawnEvent.RespawnFlag> respawnFlags)`
- `@NotNull public @NotNull Location getRespawnLocation()`
- `public void setRespawnLocation&#8203;(@NotNull @NotNull Location respawnLocation)`
- `public boolean isBedSpawn()`
- `public boolean isAnchorSpawn()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public Set<PlayerRespawnEvent.RespawnFlag> getRespawnFlags()`
