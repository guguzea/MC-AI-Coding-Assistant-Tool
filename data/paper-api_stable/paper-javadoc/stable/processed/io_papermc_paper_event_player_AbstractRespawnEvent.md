---
title: "io.papermc.paper.event.player.AbstractRespawnEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/AbstractRespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AbstractRespawnEvent**
`@NullMarked public abstract class AbstractRespawnEvent extends PlayerEvent`
- `protected Location respawnLocation`
- `protected AbstractRespawnEvent(Player respawnPlayer, Location respawnLocation, boolean isBedSpawn, boolean isAnchorSpawn, boolean missingRespawnBlock, PlayerRespawnEvent.RespawnReason respawnReason)`
- `public Location getRespawnLocation()`
- `public boolean isBedSpawn()`
- `public boolean isAnchorSpawn()`
- `public boolean isMissingRespawnBlock()`
- `public PlayerRespawnEvent.RespawnReason getRespawnReason()`
- `@Deprecated public @Unmodifiable Set<PlayerRespawnEvent.RespawnFlag> getRespawnFlags()`
