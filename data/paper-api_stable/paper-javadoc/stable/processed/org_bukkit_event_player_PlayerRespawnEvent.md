---
title: "org.bukkit.event.player.PlayerRespawnEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerRespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerRespawnEvent**
`public class PlayerRespawnEvent extends AbstractRespawnEvent`
- `@Internal @Deprecated(since="1.16.1", forRemoval=true) public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn)`
- `@Internal @Deprecated(since="1.19.4", forRemoval=true) public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn)`
- `@Internal public PlayerRespawnEvent(@NotNull @NotNull Player respawnPlayer, @NotNull @NotNull Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, boolean missingRespawnBlock, @NotNull @NotNull PlayerRespawnEvent.RespawnReason respawnReason)`
- `public void setRespawnLocation(@NotNull @NotNull Location respawnLocation)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
