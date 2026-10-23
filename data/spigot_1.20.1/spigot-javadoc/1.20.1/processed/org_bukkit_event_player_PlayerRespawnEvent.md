---
title: "org.bukkit.event.player.PlayerRespawnEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.player.PlayerRespawnEvent extends org.bukkit.event.player.PlayerEvent`
- `public org.bukkit.event.player.PlayerRespawnEvent(org.bukkit.entity.Player, org.bukkit.Location, boolean)`
- `public org.bukkit.event.player.PlayerRespawnEvent(org.bukkit.entity.Player, org.bukkit.Location, boolean, boolean)`
- `public org.bukkit.event.player.PlayerRespawnEvent(org.bukkit.entity.Player, org.bukkit.Location, boolean, boolean, org.bukkit.event.player.PlayerRespawnEvent$RespawnReason)`
- `public org.bukkit.Location getRespawnLocation()`
- `public void setRespawnLocation(org.bukkit.Location)`
- `public boolean isBedSpawn()`
- `public boolean isAnchorSpawn()`
- `public org.bukkit.event.player.PlayerRespawnEvent$RespawnReason getRespawnReason()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
